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


    async function weather(agent) {

        var cityName;
        var tempContext = agent.getContext('location');

        if (agent.parameters.city) {
            agent.add("First if works");
            cityName = agent.parameters.city;
        } else if (tempContext && tempContext.parameters.contextCity) {
            agent.add("else if works");
            cityName = tempContext;
        } else {
            agent.add("Please mention your city name");
        }

        var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;
        agent.add(`${url}`);

        await rp.get(url, function (err, response, body) {
            if (err) {
                console.log("Error:", err);
                agent.add("Error! while getting weather info from server, try again.")
            } else {

                var weather = JSON.parse(body)
                if (weather.main == undefined) {
                    agent.add("Something went wrong, try agian.");
                } else {
                    var temCelcius = Math.round(((weather.main.temp - 32) * 5 / 9));
                    var name = `${weather.name}`;
                    var weatherTxt = `It is ${temCelcius} °C in ${name}`;
                }

                agent.setContext({
                    name: "location",
                    life: 5,
                    parameters: { contextCity: `${cityName}` }
                });

                agent.add(`${weatherTxt}`);
                console.log('Success')

                return;
            }
        });

    }



    async function humidity(agent) {

        var cityName;
        var tempContext = agent.getContext('location');

        if (agent.parameters.city) {
            cityName = agent.parameters.city;
        } else if (tempContext && tempContext.parameters.contextCity) {
            cityName = tempContext;
        } else {
            agent.add("Please mention your city name");
        }

        var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;

        await rp.get(url, function (err, response, body) {
            if (err) {
                console.log("Error:", err);
                agent.add("Error! while getting weather info from server, try again.")
            } else {

                var weather = JSON.parse(body)
                if (weather.main == undefined) {
                    agent.add("Something went wrong, try agian.");
                } else {
                    var name = `${weather.name}`;
                    var humidity = `${weather.main.humidity}`;
                    var weatherTxt = `It is ${humidity} humidity in ${name}`;
                }

                agent.setContext({
                    name: "location",
                    life: 5,
                    parameters: { contextCity: `${cityName}` }
                });

                agent.add(`${weatherTxt}`);
                console.log('Success')

                return;
            }
        });

    }




    // async function humidity(agent) {

    //     var cityName = agent.parameters.city;
    //     var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';
    //     var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApi}`;

    //     if (cityName) {
    //        await rp.get(url, function (err, response, body) {
    //             if (err) {
    //                 console.log("Error:", err);
    //                 agent.add("Error! while getting weather info from server, try again.")
    //             } else {

    //                 var weather = JSON.parse(body)
    //                 if (weather.main == undefined) {
    //                     agent.add("Something went wrong, try agian.");
    //                 } else {
    //                     var temCelcius = weather.main.humidity;
    //                     var name = `${weather.name}`;
    //                     var weatherTxt = `It is ${temCelcius} Humidity in ${name}`;
    //                 }
    //                 agent.add(`${weatherTxt}`);
    //                 console.log('Success')
    //                 return;
    //             }

    //         });
    //     } else {
    //         agent.add(`Please Mention your city here `);
    //         return;
    //     }

    // }


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
    intentMap.set("humidity", humidity);

    agent.handleRequest(intentMap);

});
app.listen(process.env.PORT || 3001, function () {
    console.log("app is running in 3000");
});

