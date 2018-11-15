const express = require("express");
const routes = require("./routes.js");
const db = require("./database.js");

const app = express();

// Re-route all paths to our routing file
// app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
});

/*
----------------------------
GET requests
------------------------------
*/

/*
    !!! This request is for troubleshooting, and is to be removed before submitting the code !!!
    TODO: remove this
*/
app.get("/users", function (request, response) {
    db.getUsers().then(users => 
        response.status(200).json(users) // Return all users
    ).catch(error => response.status(404).json(error.message)) 
})



// Requesting a specific user ID
app.get("/users/:id", function (request, response) {
    const id = request.params.id
    db.getUser(id).then(user => 
        response.status(200).json(user) // Return the specific wallet with 200 OK
    ).catch(error => response.status(404).json(error.message)) 
})

// GET specific wallet
app.get("/wallets/:id", function (request, response) {
    const id = request.params.id
    db.getWallet(id).then(wallet => 
        response.status(200).json(wallet) // Return the specific wallet with 200 OK
    ).catch(error => response.status(404).json(error.message))
})

// GET specific payment
app.get("/payments/:id", function(request, response) {
    const id = request.params.id
    db.getPayment(id).then(payment => 
        response.status(200).json(payment)
    ).catch(error => response.status(404).json(error.message))
})

// GET specific payment debt
app.get("/paymentdebts/:id", function(request, response) {
    const id = request.params.id
    db.getPaymentDebt(id).then(debt => 
        response.status(200).json(debt)
    ).catch(error => response.status(404).json(error.message))
})

/*
-------------------------------
POST requests
--------------------------------
*/

const bodyParser = require('body-parser') // TODO: Move this to a more fitting place
app.use(bodyParser.json()) // Set bodyparser to JSON? Need to look this up

app.post("/users", function(request, response) {
    const userToAdd = request.body

    const users = db.getUsers().then(users => {
        userToAdd.id = users[users.length-1].id + 1
        db.addUser(userToAdd)
        response.status(201).json("Location: users/" + userToAdd.id)
    }).catch(error => {
        console.log("Error with POST /users")
        response.status(500).end("There was an error with post/users :(")
    })
})



/* 
---------------------------------
PUT requests
--------------------------------
*/