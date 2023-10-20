![cropzone poster](https://github.com/Tlotlo-pat/cropzone/assets/51744364/e46596b2-c1b9-498f-bbc9-cd5179f4cd3d)
# Crop Zone:  Making Crop Farming Simple and Efficient with USSD and AI

## Table of Contents
- [Project Summary](#project-summary)
- [The Issue We Are Hoping to Solve](#the-issue-we-are-hoping-to-solve)
- [How Our Technology Solution Can Help](#how-our-technology-solution-can-help)
- [Our Idea](#our-idea)
- [Technology Implementation](#technology-implementation)
  - [IBM AI Service(s) Used](#ibm-ai-services-used)
  - [Other IBM Technology Used](#other-ibm-technology-used)
- [Solution Architecture](#solution-architecture)
- [Presentation Materials](#presentation-materials)
- [Project Development Roadmap](#project-development-roadmap)
- [How to Run the Project](#how-to-run-the-project)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
  
## Project Summary

Crop Zone is a pioneering USSD application aimed at empowering African farmers with crucial agricultural insights. By utilizing advanced technologies, including IBM AI services and other IBM tools, Crop Zone delivers real-time data on crop distribution, soil quality, seasonal recommendations, and valuable farming tips, thereby revolutionizing farming practices and fostering sustainable agriculture aligned with the United Nations Sustainable Development Goals.

## The Issue We Are Hoping to Solve

Crop Zone seeks to address the critical information gap prevalent in African agriculture. Limited access to accurate and timely data, coupled with unpredictable weather patterns and inadequate soil management, hinder smallholder farmers' productivity and profitability. This app aims to bridge this gap by delivering actionable insights directly to farmers' mobile phones.

## How Our Technology Solution Can Help

Crop Zone's innovative USSD interface, backed by IBM AI services, enables farmers to access pertinent information without requiring internet connectivity. By offering personalized crop recommendations, real-time crop distribution data, and seasonal insights, Crop Zone equips farmers with the tools to make informed decisions, enhance productivity, and embrace sustainable farming practices.

## Our Idea

Open the google doc to view 500 word description [500 word desc](https://docs.google.com/document/d/1FRz0vlkPEKNH2dMuTqaQ8OQ4VskU6lPq-i544iFcbgg/edit)

## Technology Implementation

**IBM AI Service(s) Used:**
- IBM Language Translator , the user choose preferred language.
In our project, 'CropZone,' we have harnessed the power of IBM AI Language Translator to ensure that our application is accessible and user-friendly to a global audience. Users can effortlessly select their preferred language, and the language translator dynamically translates all text-based content in real-time. This feature eliminates language barriers and enables users from various linguistic backgrounds to benefit from the wealth of information and services provided by CropZone, making it a truly inclusive tool for crop farmers and enthusiasts worldwide.

```
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
```

**Other IBM Technology Used:**
- IBM Cloudant for real-time data storage and retrieval.
- IBM Weather Company for precise weather data integration.
  
## Solution Architecture

![CRPZONE drawio](https://github.com/Tlotlo-pat/cropzone/assets/51744364/ffe82672-7e43-4802-bdf4-a0f1faaa3059)

1.Africa's Talking USSD Gateway: This component is responsible for receiving USSD requests from mobile network operators and forwarding them to the Node.js application.

2.Node.js Application: This is the core of our USSD application. It handles incoming USSD requests, processes user input, and generates USSD responses. It interacts with IBM Cloudant and other components to provide the required information to users.

3.Weather Company API: This is an external API that provides weather information. You can use it to get seasonal data for crop recommendations based on the current weather conditions.

4.IBM Cloud: 
- Cloudant: This is the database where we store data related to crop distribution, soil quality analysis, quiz questions, and other information.
- Language Translator: IBM AI service integrated to the app to handle language translation.

## Presentation Materials

### Project Demo video

https://github.com/Tlotlo-pat/cropzone/assets/51744364/88c8d038-5b20-479e-b2ab-247d5205e62a

### Project Development Roadmap

![CropZone Roadmap](https://github.com/Tlotlo-pat/cropzone/assets/51744364/cc693c73-ca87-4e8c-a1ca-cf545ca24f3a)

## How to Run the Project

#### 1.Setup Africa Talking
- Visit https://africastalking.com/ and create a new account or login if you have one. 
- Follow the following instructions on this link on how to setup Africa Talking dashboard https://medium.com/@chegemaimuna/africas-talking-node-js-express-ussd-application-7e10aa400b98

#### 2.Clone Node js code
 - Git clone https://github.com/Tlotlo-pat/cropzone
 - Clone to your local machine and run "node index.js"


## Versioning

We use Semantic Versioning (SemVer) for version control. For available versions, see the tags in this repository.

## Authors

- [Tlotlo Patriot Kgotlafela](link-to-your-profile) - Developer


## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project template is based on [Billie Thompson's README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2).


