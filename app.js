// const express = require("express");
// const bodyParser = require("body-parser");
// const req = require("request");
// const rp = require("request-promise");

// const { WebhookClient } = require("dialogflow-fulfillment");

// const app = express().use(bodyParser.json());

// app.get("/", function (request, response) {
//     response.send("Hello world!");
// });

// app.post("/webhook", function (request, response, next) {
//     const agent = new WebhookClient({ request: request, response: response });


//     async function weather(agent) {

//         var cityName;
//         const tempContext = agent.getContext("location");

//         if (agent.parameters.city) {
//             cityName = agent.parameters.city;
//         } else if (tempContext && tempContext.parameters.contextCity) {
//             cityName = tempContext;
//         } else {
//             agent.add("Please mention your city name");
//         }

//         var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
//         var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;

//         await rp.get(url, function (err, response, body) {
//             if (err) {
//                 console.log("Error:", err);
//                 agent.add("Error! while getting weather info from server, try again.")
//             } else {

//                 var weather = JSON.parse(body)
//                 if (weather.main == undefined) {
//                     agent.add("Something went wrong, try agian.");
//                 } else {
//                     var temCelcius = Math.round(((weather.main.temp - 32) * 5 / 9));
//                     var name = `${weather.name}`;
//                     var weatherTxt = `It is ${temCelcius} °C in ${name}`;
//                 }

//                 agent.setContext({
//                     name: "location",
//                     lifespan: 5,
//                     parameters: { contextCity: cityName }
//                 });

//                 agent.add(`${weatherTxt}`);
//                 console.log('Success')

//                 return;
//             }
//         });

//     }



//     async function humidity(agent) {

//         var cityName;
//         const tempContext = agent.getContext("location");

//         if (agent.parameters.city) {
//             cityName = agent.parameters.city;
//         } else if (tempContext && tempContext.parameters.contextCity) {
//             cityName = tempContext;
//         } else {
//             agent.add("Please mention your city name");
//         }

//         var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
//         var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;

//         await rp.get(url, function (err, response, body) {
//             if (err) {
//                 console.log("Error:", err);
//                 agent.add("Error! while getting weather info from server, try again.")
//             } else {

//                 var weather = JSON.parse(body)
//                 if (weather.main == undefined) {
//                     agent.add("Something went wrong, try agian.");
//                 } else {
//                     var name = `${weather.name}`;
//                     var humidity = `${weather.main.humidity}`;
//                     var weatherTxt = `It is ${humidity} humidity in ${name}`;
//                 }

//                 agent.setContext({
//                     name: "location",
//                     lifespan: 5,
//                     parameters: { contextCity: cityName }
//                 });
//                 agent.add(`${weatherTxt}`);
//                 console.log('Success')

//                 return;
//             }
//         });

//     }

//     function welcome(agent) {
//         agent.add("Hello! I am weatherBot, Want to know the weather?");
//         agent.add("Please type your city name");
//     }

//     function fallback() {
//         agent.add("Sorry! I didn't understand.");
//         agent.add("Please type again.");
//     }

//     let intentMap = new Map();
//     intentMap.set("Default Welcome Intent", welcome);
//     intentMap.set("Default Fallback Intent", fallback);
//     intentMap.set("weather", weather);
//     intentMap.set("humidity", humidity);

//     agent.handleRequest(intentMap);

// });
// app.listen(process.env.PORT || 3001, function () {
//     console.log("app is running in 3000");
// });






//  ============================ Abrar Code Start Rrom Here
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