const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api", async (req, res) => {
  const { country } = req.body;

  const splitCountry = country.split(" ")[0] + "-" + country.split(" ")[1];

  try {
    const { data: countryData } = await axios(
      `https://restcountries.eu/rest/v2/name/${encodeURI(country)}`
    );
    const { data: casesData } = await axios(
      `https://api.covid19api.com/total/country/${splitCountry}?from=2020-07-17T00:00:00Z&to=2020-07-19T00:00:00Z`
    );

    const countryToSend = {
      name: countryData[0].name,
      population: countryData[0].population,
      flag: countryData[0].flag,
      confirmed: casesData[0].Confirmed,
      deaths: casesData[0].Deaths,
      recovered: casesData[0].Recovered
    };

    res.json([countryToSend]);
  } catch (e) {
    console.log(e);
  }
});

const port = 8000;
app.listen(port, () => console.log(`[app]: Listening on port ${port}`));
