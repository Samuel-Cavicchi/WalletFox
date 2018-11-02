const express = require("express");

const app = express();

const wallets = [
    {
        id: 1,
        name: "Sam's Wallet",
        currency: "SEK"
    },
    {
        id: 2,
        name: "Group House",
        currency: "AUD"
    }
];

const payments = [ // A list of all payments
    {
        id: 1,
        wallet: 2, // Wallet ID
        payee: 1324, // uid of the person who is owed money
        description: "Bought lunch",
        paymentDate: new Date().valueOf()
    }
]

const paymentOwing = [
    {
        id: 1,
        userOwing: 1333, // The user who must pay money
        payment: 1, // The corresponding payment (which includes the payee)
        amount: 60.0
    }
]



app.listen(8080);

// Requesting all wallets
app.get("/wallets", function(request, response){
    response.status(200).json(wallets); // Return all wallets with 200 OK
})

// Requesting a specific wallet ID
app.get("wallets:id", function(request, response){
    const id = request.params.id;
    const wallet = wallets.find(wallet => wallet.id == id);
    if(wallet) { // If wallet != null
        response.status(200).json(wallet); // Return the specific wallet with 200 OK
    } else {
        response.status(400).end(); // If wallet does not exist, return 400 Bad Request
    }
})
