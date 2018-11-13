db = require('../database.js');
// Requesting all wallets
app.get("/users", function (request, response) {
    response.status(200).json(wallets); // Return all wallets with 200 OK
})

// Requesting a specific wallet ID
app.get("/wallets/:id", function (request, response) {
    const id = request.params.id;
    const wallet = wallets.find(wallet => wallet.id == id);
    if (wallet) { // If wallet != null
        response.status(200).json(wallet); // Return the specific wallet with 200 OK
    } else {
        response.status(400).end(); // If wallet does not exist, return 400 Bad Request
    }
})