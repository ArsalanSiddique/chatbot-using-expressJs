var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const { WebhookClient } = require("dialogflow-fulfillment");

var app = express().use(bodyParser.json());

app.get("/", function (request, response) {
    response.send("Hello world!");
});

app.post("/webhook", function (req, res, next) {
    const agent = new webHookClient({ request: req, response: res });
});

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

expressApp.listen(process.env.PORT || 3000, function () {
    console.log("app is running in 3000");
});