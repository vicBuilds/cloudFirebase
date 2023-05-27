const functions = require("firebase-functions");
const express = require("express");
const app = express();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const axios = require("axios");

require("dotenv").config();

// Config for the headers and the URL for the API (souce: Rapid API)
const options = {
  method: "GET",
  url: process.env.URL,
  headers: {
    "X-RapidAPI-Key": process.env.KEY,
    "X-RapidAPI-Host": process.env.HOST,
  },
};

app.post("/fetch-diesel-prices", async (req, res) => {
  try {
    let response = await axios.request(options);

    /* ****** Important Node: Sorry I just exceeded the mothly limit for 30 calls for the api which was for free.
         
         // The data is in the key response.data.statePrices array
        // Lets try to keep only the diesel prices and send
    
        // Lets filter the diesel prices only
        
        let fullData = response.data.statePrices;
    
        let dataToBeSent = fullData.map((element) => {
          let temp = { ...element, dieselPrice: element.fuel.diesel };
          //   Lets also remove the key fuel and set dieselPrice(It will look good)
          let { fuel, ...rest } = temp;
    
          // Did this with destructuring
    
          let dataFinal = { ...rest };
          return dataFinal;
        });
    
        // Now the data only has diesel in the fuel section
    
         */

    //So i have rewrite the code to fetch only data of a state for the time being. Free limit got exhaustdd while testing

    let dataToBeSent = response.data;
    dataToBeSent.fuel = dataToBeSent.fuel.diesel;

    console.log(dataToBeSent);

    // Lets send the data to the end point
    const urlToSendData = "https://en03k0l91q0m9c.x.pipedream.net/";
    let isDataSend = await axios.post(urlToSendData, dataToBeSent);
    //console.log(isDataSend);

    console.log("State wise Diesel Prices sent successfully.");
    res
      .status(200)
      .json({ message: "State wise Diesel prices sent successfully." });
  } catch (error) {
    console.error("The are some error sending the data", error);
    res.status(500).json({ message: "Server Error" });
  }
});

exports.fetchDieselPrices = functions.https.onRequest(app);
