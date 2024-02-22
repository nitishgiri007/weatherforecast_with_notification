const express = require("express");
const twilio = require("twilio");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const axios = require("axios");
const apiKey = process.env.apiKey;

async function sendSMS(name, windSpeed, weatherMain, tempMin, tempMax) {
  const client = new twilio(
    "ACa4739096866fcb76f96745a812635f37",
    "10bcdbc897c010166221d070e1a75f92"
  );
  try {
    const message = await client.messages.create({
      body: `Place: ${name}, Wind Speed: ${windSpeed}, Weather Main: ${weatherMain}, Temp Min: ${tempMin}, Temp Max: ${tempMax}`,
      from: "+17152008463",
      to: "+917488059189",
    });
    console.log(message);
  } catch (err) {
    console.error(err);
  }
}

app.get("/", async function (req, res) {
  const address = req.query.address;
  console.log(address);
  if (!address) {
    return res.status(400).send({ error: "Address is required" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    await sendSMS(
      data.name,
      data.wind.speed,
      data.weather[0].main,
      data.main.temp_min,
      data.main.temp_max
    );

    res.status(200).json({
      status: "success",
      data: data,
      city: data.name,
      weather: data.weather[0].main,
      wind_speed: data.wind.speed,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/sendnotification", async function (req, res) {
  // Implement your notification logic here
  res.status(200).send("Notification sent");
});

app.listen(port, function () {
  console.log("Connection successful on port " + port);
});
