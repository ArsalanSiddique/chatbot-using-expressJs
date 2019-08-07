var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express().use(bodyParser.json());

app.post("/webhook", function (request, response, next) {
    const agent = new webHookClient({ request: request, response: response });


    function welcome(agent) {
        agent.add("Hello! I am weatherBot, Want to know the weather?");
        agent.add("Please type your city name");
    }

    function fallback() {
        agent.add("Sorry! I didn't understand.");
        agent.add("Please type again.");
    }

    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);

});
app.listen(process.env.PORT || 3001, function () {
    console.log("app is running in 3000");
});


//==========  Abrar code start here //

// const express = require("express");
// const bodyParser = require("body-parser");
// var request = require("request");

// const { WebhookClient } = require("dialogflow-fulfillment");


// let apiKey='4970e4f266675063af77ad454f45ebd6';


// const expressApp = express().use(bodyParser.json());

// expressApp.post("/webhook", function (request, response, next) {
//   const agent = new WebhookClient({ request: request, response: response });

//   function welcome(agent) {
//     agent.add(`Good day! What can I do for you today?`);
//   }

//   function fallback(agent) {
//     agent.add(`I didn't understand`);
//     agent.add(`I'm sorry, can you try again?`);
//   }
//   let intentMap = new Map();
//   intentMap.set("Default Welcome Intent", welcome);
//   intentMap.set("Default Fallback Intent", fallback);

//   agent.handleRequest(intentMap);

// });
// expressApp.listen(process.env.PORT || 3000, function () {
//   console.log("app is running in 3000");
// });