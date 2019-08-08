const express = require("express");
const bodyParser = require("body-parser");
var req = require("request");
var rp = require("request-promise");

const { WebhookClient } = require("dialogflow-fulfillment");

const expressApp = express().use(bodyParser.json());

expressApp.post("/webhook", function(request, response, next) {
  const agent = new WebhookClient({ request: request, response: response });

  async function weatherFinder(agent) {
    const tempContext = agent.getContext("location");
    console.log("return Context is :", tempContext);
    var cityName;
    if (agent.parameters.city) {
      cityName = agent.parameters.city;
    } else if ( tempContext && tempContext.parameters.contextcity ) {
      cityName = tempContext.parameters.contextcity;
    } else {
      agent.add(`Please Mention your city here `);
      return;
      
    }

    let apiKey = "4970e4f266675063af77ad454f45ebd6";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`;
    // agent.add(`The weather for the city ${cityName} is: ?? ...... `);

    await rp.get(url, function(err, response, body) {
      if (err) {
        console.log("error:", err);
        agent.add("Error while getting weather report");
      } else {
        let weather = JSON.parse(body);
        let message = `${weather.main.temp} degrees and ${
          weather.main.humidity
        } humidity !`;
        console.log("weather:", message);
        let temp = weather.main.temp;
        console.log("temperature:", temp);

        console.log("City Name:", cityName);
        agent.setContext({
          name: "location",
          lifespan: 5,
          parameters: { contextcity: cityName }
        });
        agent.add(`The weather for the city ${cityName} is: ${message} `);
        console.log("Success:");
        return;
      }
    });
  }

  async function humidityFinder(agent) {
    const tempContext = agent.getContext("location");
    console.log("return Context is :", tempContext);
    var cityName;
    if (agent.parameters.city) {
      cityName = agent.parameters.city;
    } else if (tempContext && tempContext.parameters.contextcity ) {
      cityName = tempContext.parameters.contextcity;
    } else {
      agent.add(`Mention your city here `);
      return;
      
    }

    let apiKey = "4970e4f266675063af77ad454f45ebd6";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`;

    await rp.get(url, function(err, response, body) {
      if (err) {
        console.log("error:", err);
        agent.add("Error while getting weather report");
      } else {
        let weather = JSON.parse(body);
        let humidity = weather.main.humidity;
        console.log("City Name:", cityName);
        console.log("Humidity:", humidity);
        agent.setContext({
          name: "location",
          lifespan: 5,
          parameters: { contextcity: cityName }
        });
        agent.add(`In ${cityName} humidity is: ${humidity}%`);
        console.log("Success:");
        return;
      }
    });
  }

  function welcome(agent) {
    agent.add(`Good day! What can I do for you today?`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("weather", weatherFinder);
  intentMap.set("humidity", humidityFinder);

  agent.handleRequest(intentMap);
});
expressApp.listen(process.env.PORT || 3000, function() {
  console.log("app is running in 3000");
});