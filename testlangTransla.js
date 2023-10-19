const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// Set up the Language Translator service
const languageTranslator = new LanguageTranslatorV3({
    version: '2021-09-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.LANGUAGE_KEY,
    }),
    serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/6b79bdcf-aaa5-4b4f-bfd1-b9d316faa62d',
});

// Test translation
const translateParams = {
    text: 'I want to translate the whole application',
    source: 'en', // Source language
    target: 'ar', // Target language
};

languageTranslator.translate(translateParams)
    .then(translationResult => {
        console.log('Translated text:', translationResult.result.translations[0].translation);
    })
    .catch(err => {
        console.error('Error translating text:', err);
    });
