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
Experience Crop Zone in action through our [Live Demo](https://www.youtube.com/watch?v=wp30Zb2Oq_M)

### Project Development Roadmap

![CropZone Roadmap](https://github.com/Tlotlo-pat/cropzone/assets/51744364/cc693c73-ca87-4e8c-a1ca-cf545ca24f3a)

## How to Run the Project

#### 1.Setup Africa Talking
- Visit https://africastalking.com/ and create a new account or login if you have one. 
- Follow the following instructions on this link on how to setup Africa Talking dashboard [](https://medium.com/@chegemaimuna/africas-talking-node-js-express-ussd-application-7e10aa400b98)

#### 2.Clone Node js code
Git clone https://github.com/Tlotlo-pat/cropzone


## Versioning

We use Semantic Versioning (SemVer) for version control. For available versions, see the tags in this repository.

## Authors

- [Tlotlo Patriot Kgotlafela](link-to-your-profile) - Developer


## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project template is based on [Billie Thompson's README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2).


