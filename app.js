const express = require("express");
const bodyParser = require("body-parser");
const req = require("request");
const rp = require("request-promise");

const { WebhookClient } = require("dialogflow-fulfillment");

const app = express().use(bodyParser.json());

app.get("/", function (request, response) {
    response.send("Hello world!");
});

app.post("/webhook", function (request, response, next) {
    const agent = new WebhookClient({ request: request, response: response });


    function weather(agent) {
        
        var cityName = agent.parameters.city;
        var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;

        rp.get(url, function(err, response, body) {
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
    intentMap.set("weather", weather);

    agent.handleRequest(intentMap);

});
app.listen(process.env.PORT || 3001, function () {
    console.log("app is running in 3000");
});

