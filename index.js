require('dotenv').config()

const express =  require('express')
const app = express()
const ussdMenu = require('ussd-builder')
const mongoose = require('mongoose')
const Cloudant = require('cloudant');
const nano = require('nano');
const stringSimilarity = require('string-similarity');
const axios = require('axios');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


// Database connects
const Model = require('./models/model')


// Replace 'YOUR_CLOUDANT_URL' with your actual Cloudant URL
const cloudant = nano('https://apikey-v2-s5ctzuxeje7ocwqsuzeu88h3sy376qzene5oznhdf3k:6d9006acac449d0aa79ba4da37755726@707d68dd-3c8a-40d1-9e10-e97fb37eee0b-bluemix.cloudantnosqldb.appdomain.cloud');

cloudant.db.get('cropzone', (err, body) => {
    if (err) {
        console.error('Failed to connect to Cloudant:', err);
    } else {
        console.log('Connected to Cloudant :)');
    }
});
  
const database = cloudant.db.use('cropzone');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// USSD Setup
const menu = new ussdMenu()

//setup language translator
const languageTranslator = new LanguageTranslatorV3({
    version: '2021-09-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.LANGUAGE_KEY,
    }),
    serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/6b79bdcf-aaa5-4b4f-bfd1-b9d316faa62d',
});

const languages = {
    '1': 'en', // English
    '2': 'fr', // French
    '3': 'ar', // Arabic
    '4': 'pt', // Portuguese
};

let selectedLanguage = 'en';



menu.startState({
    run: () => {
        menu.con('Select your preferred language:\n1. English\n2. French\n3. Arabic\n4. Portuguese');
    },
   
        next: {
            '*[1-4]': (userResponse) => {
                selectedLanguage = languages[userResponse];
                
            },
        },

       
    
});

// Define a translateAndDisplay function to translate and display messages
function translateAndDisplay(message, targetLanguage) {
    const translateParams = {
        text: message,
        source: 'en', // Source language
        target: targetLanguage, // Target language based on user selection
    };

    // Translate the message
    languageTranslator.translate(translateParams)
        .then(translationResult => {
            const translatedMessage = translationResult.result.translations[0].translation;
            menu.con(translatedMessage);
        })
        .catch(err => {
            console.error('Error translating text:', err);
        });
}
menu.state( 'MainMenuState' ,{
    run: () => {
        translateAndDisplay('Welcome to CropZone!\n\nWe make crop farming simple and efficient. Explore our features to access crop distribution information, soil quality analysis, seasonal crop recommendations, farming tips, and more. Choose an option:\n1. Search Crop Distribution\n2. Soil Quality Analysis\n3. Seasonal Crop Recommendations\n4. Farmer\'s Tip of the Day\n5. Crop Trivia\n6. Help\n7. Quit', selectedLanguage);
    },
    next: {
       '1': 'SearchCropDistribution', // State key for searching crop distribution
       '2': 'SoilQualityAnalysis', // State key for soil quality analysis
       '3': 'SeasonalCropRecommendations', // State key for seasonal crop recommendations
       '4': 'FarmersTipOfTheDay', // State key for farmer's tip of the day
       '5': 'CropTrivia', // State key for crop trivia
       '6': 'Help', // State key for help
       '7': 'Quit' // State key for quitting the USSD session
    }
});



//universal state to go back
menu.state('BackPlaceholder', {
    run: () => {
        // This state does not display anything
        // It's just a placeholder for a back action
    },
    next: {
        '*': 'UniversalBack'
    }
});

menu.state('UniversalBack', {
    run: (userResponse) => {
        if (menu.history.length > 1) {
            // Get the previous state from the history array
            const prevState = menu.history.pop();
            // Transition to the previous state
            menu.goto(prevState);
        } else {
            menu.end('You are already at the initial state.');
        }
    }
});
// State for searching crop distribution
menu.state('SearchCropDistribution', {
    run: () => {
        // Logic for searching crop distribution
        // Provide instructions to the user and gather input
        menu.con('Enter the district name / village name or type 0 to go back:');
        menu.history.push('SearchCropDistribution');
    },
    // Handle user response for searching crop distribution
    next: {
        // Assuming 'HandleCropDistribution' is the state key to handle user input for crop distribution search
        '*': 'HandleCropDistribution',
        '0': 'BackPlaceholder'
    }
});

// State for handling user input for crop distribution search
menu.state('HandleCropDistribution', {
    run: (userResponse) => {
        const inputName = userResponse.val.toLowerCase();

        // Fetch all documents from the database
        database.list({ include_docs: true }, (err, body) => {
            if (err) {
                console.error('Error fetching data:', err);
                menu.end('An error occurred while fetching data. Please try again later.');
            } else {
                const documents = body.rows.map(row => row.doc);
                const districtNames = documents.map(doc => doc.district.toLowerCase());
                const villageNames = documents.flatMap(doc => doc.villages.map(village => village.toLowerCase()));
                
                // Find the best matching name using string similarity
                const nameMatches = stringSimilarity.findBestMatch(inputName, districtNames.concat(villageNames));
                const bestMatchName = nameMatches.bestMatch.target;

                // Find the data for the best matching name
                const matchedData = documents.find(doc => doc.district.toLowerCase() === bestMatchName || doc.villages.some(village => village.toLowerCase() === bestMatchName));

                if (matchedData) {
                    const cropData = {
                        Sorghum: matchedData.Sorghum,
                        Maize: matchedData.Maize,
                        BeansPulses: matchedData['Beans/Pulses'],
                        Millet: matchedData.Millet,
                        Sunflower: matchedData.Sunflower,
                        Groundnuts: matchedData.Groundnuts,
                        Watermelons: matchedData.Watermelons,
                        OtherCrops: matchedData['Other Crops']
                    };

                    const topCrops = Object.keys(cropData)
                        .filter(crop => crop !== 'OtherCrops')
                        .sort((a, b) => cropData[b] - cropData[a])
                        .slice(0, 3)
                        .join(', ');

                    menu.con(`The most planted crops in ${matchedData.district} are ${topCrops}. Type 0 to go back.`);
                } else {
                    menu.con(`No data found for ${inputName}.`);
                }
            }
        });
        menu.history.push('HandleCropDistribution');
    },
    next: {
        '0': 'BackPlaceholder'
    }
});

// ...


// State for soil quality analysis
menu.state('SoilQualityAnalysis', {
    run: () => {
        // Logic for soil quality analysis
        // Provide instructions to the user and gather input
        menu.con('Enter the region name or code:');
    },
    // Handle user response for soil quality analysis
    next: {
        // Assuming 'HandleSoilQuality' is the state key to handle user input for soil quality analysis
        '*': 'HandleSoilQuality'
    }
});

// State for handling user input for soil quality analysis
menu.state('HandleSoilQuality', {
    run: (userResponse) => {
        const region = userResponse.val;
        // Logic to process user input and provide soil quality analysis and crop recommendations
        // You can query the database or external API to get soil quality data and recommend crops based on 'region'
        // Display the soil quality analysis and crop recommendations to the user
        menu.con(`Based on the soil quality in ${region}, suitable crops are maize, tomatoes, and cabbage.`);
    },
    // You can add more states to handle user interactions for soil quality analysis if needed
});

// State for seasonal crop recommendations
menu.state('SeasonalCropRecommendations', {
    run: () => {
        menu.con('Please choose your district:\n1. Gaborone\n2. Francistown\n3. Maun\n4. Serowe\n5. Selebi-Phikwe\n');
    },
    next: {
        '*': 'FetchWeatherForecast'
    }
});

// State for fetching weather forecast and suggesting crops
menu.state('FetchWeatherForecast', {
    run: (userResponse) => {
        const districtCode = userResponse.val;

        // Mapping of districts to coordinates
        const districtCoordinates = {
            '1': { lat: -24.6541, lon: 25.9087 }, // Gaborone
            '2': { lat: -21.1714, lon: 27.5120 }, // Francistown
            '3': { lat: -19.9894, lon: 23.4181 }, // Maun
            '4': { lat: -22.3833, lon: 26.7167 }, // Serowe
            '5': { lat: -22.0000, lon: 27.0000 }, // Selebi-Phikwe
        };

        const selectedDistrict = districtCoordinates[districtCode];

        if (selectedDistrict) {
            // Make API call to Weather Company API
            const apiKey = process.env.WEATHER_KEY;
            const apiUrl = `https://api.weather.com/v3/wx/forecast/daily/5day?geocode=${selectedDistrict.lat},${selectedDistrict.lon}&language=en-US&format=json&apiKey=${apiKey}`;
            
            const queryParams = {
   
               units: 'e' // or 'm' for metric units    
            };
            // Fetch weather data and process suggested crops
            axios.get(apiUrl, {params: queryParams})
                .then(response => {
                    const weatherData = response.data;
                    const suggestedCrops = [];

                    // Logic to determine suggested crops based on weather conditions
                    // Example logic: If average temperature is high and there is good rainfall, suggest crops like maize, millet, cowpeas, etc.
                    // You should adjust the conditions and suggested crops based on the weather data you receive

                    // Example: If average temperature is greater than 25°C and there is rainfall, suggest the following crops
                    if (weatherData.daypart[0].temperature[1] > 25 && weatherData.daypart[0].qpf[1] > 0) {
                        suggestedCrops.push('Maize', 'Millet', 'Cowpeas');
                    }
                    if (weatherData.daypart[0].temperature[1] > 30 && weatherData.daypart[0].qpf[1] > 0) {
                        suggestedCrops.push('Sorghum', 'Pearl Millet', 'Groundnuts');
                    }
                    
                    if (weatherData.daypart[0].temperature[1] > 28 && weatherData.daypart[0].qpf[1] === 0) {
                        suggestedCrops.push('Sunflower', 'Sesame', 'Cowpeas');
                    }
                    // You can add more conditions and suggested crops based on other weather data

                    if (suggestedCrops.length > 0) {
                        menu.con(`Based on the weather forecast, suggested crops for your district are: ${suggestedCrops.join(', ')}.`);
                    } else {
                        menu.con('No specific crop recommendations based on the weather forecast.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    menu.con('An error occurred while fetching weather data. Please try again later.');
                });
        } else {
            menu.con('Invalid district selection. Please try again.');
        }
    },
    next: {
        '0': 'BackPlaceholder'
    }
});



// State for farmer's tip of the day
menu.state('FarmersTipOfTheDay', {
    run: () => {
        // Fetch all documents from the Cloudant database
        database.list({ include_docs: true }, (err, body) => {
            if (err) {
                console.error('Error fetching data:', err);
                menu.end('An error occurred while fetching data. Please try again later.');
            } else {
                const documents = body.rows.map(row => row.doc);

                // Find the document that contains the tips array
                const tipsDocument = documents.find(doc => doc.tips);

                if (tipsDocument && Array.isArray(tipsDocument.tips) && tipsDocument.tips.length > 0) {
                    // Get a random tip from the tips array
                    const randomTip = tipsDocument.tips[Math.floor(Math.random() * tipsDocument.tips.length)];
                    menu.con(`Farmer's Tip of the Day: ${randomTip}`);
                } else {
                    menu.con("No tips available at the moment.");
                }
            }
        });
    },
});


// State for crop trivia
menu.state('CropTrivia', {
    run: () => {
        // Logic for crop trivia
        // Provide a random crop-related trivia question and options
        const question = "Which crop is known as the 'king of cereals'?";
        const options = [
            "1. Wheat",
            "2. Rice",
            "3. Maize",
            "4. Barley",
        ];
        // Store the correct answer for validation when the user responds
        const correctAnswer = "3";
        menu.con(`${question}\n${options.join("\n")}`);
    },
    // Handle user response for crop trivia
    next: {
        // Assuming 'HandleCropTriviaResponse' is the state key to handle user input for crop trivia
        '*': 'HandleCropTriviaResponse'
    }
});

// State for handling user input for crop trivia
menu.state('HandleCropTriviaResponse', {
    run: (userResponse) => {
        // Validate the user's answer and provide feedback
        const userAnswer = userResponse;
        const correctAnswer = "3";
        if (userAnswer === correctAnswer) {
            menu.con("Correct! Maize is known as the 'king of cereals.' Great job!");
        } else {
            menu.con("Incorrect answer. Maize is the correct answer. Keep learning!");
        }
    },
});

// State for help
menu.state('Help', {
    run: () => {
        // Provide instructions on how to use the USSD application or any additional information
        menu.con(`CropZone USSD App Help:\n- To search crop distribution, enter 1 and provide the region name or code.\n- To check soil quality, enter 2 and provide the region name or code.\n- To get seasonal crop recommendations, enter 3.\n- To receive a farmer's tip of the day, enter 4.\n- To participate in crop trivia, enter 5.\n- For general assistance, enter 6.\n- To quit, enter 7.`);
    },
});


// State for quitting the USSD session
menu.state('Quit', {
    run: () => {
        // End the USSD session with a farewell message
        menu.end('Thank you for using CropZone. Have a great day!');
    }
});

const port = 3007; // Port on which your Node.js server will run

app.post('/ussd', (req, res) => {menu.run(req.body, ussdResult => {res.send(ussdResult)})})


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});