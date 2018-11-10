/* 
Routes.js redirects all app routes to the correct route
*/

const routes = require("express").Router();


routes.get('/', (req, res) => {
    res.status(200).json({message: "Connected to WalletFox"})
});

// // Requesting all wallets
// app.get("/wallets", function (request, response) {
//     response.status(200).json(wallets); // Return all wallets with 200 OK
// })

// // Requesting a specific wallet ID
// app.get("wallets:id", function (request, response) {
//     const id = request.params.id;
//     const wallet = wallets.find(wallet => wallet.id == id);
//     if (wallet) { // If wallet != null
//         response.status(200).json(wallet); // Return the specific wallet with 200 OK
//     } else {
//         response.status(400).end(); // If wallet does not exist, return 400 Bad Request
//     }
// })

// Export our express router module with all our custom routes
module.exports = routes;
