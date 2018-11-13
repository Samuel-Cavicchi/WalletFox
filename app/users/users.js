db = require('../database.js');
const routes = require("express").Router();

// Requesting all wallets
// routes.get("/", function (request, response) {
//     response.status(200).json(wallets); // Return all wallets with 200 OK
// })

// Requesting a specific wallet ID
routes.get("/:id", function (request, response) {
    console.log('found users');
    // const id = request.params.id;
    // const wallet = wallets.find(wallet => wallet.id == id);
    // if (wallet) { // If wallet != null
    //     response.status(200).json(wallet); // Return the specific wallet with 200 OK
    // } else {
    //     response.status(400).end(); // If wallet does not exist, return 400 Bad Request
    // }
})
