const express = require("express");
const routes = require("./routes.js");
const db = require("./database.js");
const bodyParser = require('body-parser') // TODO: Move this to a more fitting place after discussion

const app = express();
app.use(bodyParser.urlencoded({ extended: false })) // Set bodyparser to JSON? Need to look this up

// Re-route all paths to our routing file
app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
});

/*
----------------------------
GET requests
------------------------------
*/

/*
    ------------------------------------------------------ !!!!
    !!! These requests are for troubleshooting, and are to be removed before submitting the code !!!
    TODO: remove this unless we can find a good reason to keep them. If not it's a security risk
*/
app.get("/users", function (request, response) {
    db.getUsers().then(users =>
        response.status(200).json(users) // Return all users
    ).catch(error => response.status(404).json(error.message))
})


app.get("/wallets", function (request, response) {
    db.getWallets().then(wallets => {
        response.status(200).json(wallets)
    }).catch(error => response.status(500).json(error.message))
})

/*
    End of functions to be removed
    -------------------------------------------------------------- !!!!
*/

app.get("/searchUsers/", function(request, response) {
    const body = request.body
    let foundUsers = []

    db.getUsers().then(users => {
        for (key in body) {
            foundUsers.push(users.filter(u => u[key] == body[key]))
        }
        console.log(foundUsers)
    })
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
app.get("/payments/:id", function (request, response) {
    const id = request.params.id
    db.getPayment(id).then(payment =>
        response.status(200).json(payment)
    ).catch(error => response.status(404).json(error.message))
})

// GET specific payment debt
app.get("/paymentdebts/:id", function (request, response) {
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

app.post("/users", function (request, response) {
    const userToAdd = request.body

    const users = db.getUsers().then(users => {
        userToAdd.id = users[users.length - 1].id + 1
        db.addUser(userToAdd)
        response.status(201).json("Location: users/" + userToAdd.id)
    }).catch(error => {
        response.status(500).end("There was an error with post/users :(")
    })
})

app.post("/wallets", function (request, response) {
    const walletToAdd = request.body

    const wallets = db.getWallets().then(wallets => {
        walletToAdd.id = wallets[wallets.length - 1].id + 1
        db.addWallet(walletToAdd)
        response.status(201).json("Location: wallets/" + walletToAdd.id)
    }).catch(error => {
        response.status(500).end("There was an error with post/wallets :(")
    })
})


/* 
---------------------------------
PUT requests
--------------------------------
*/



/*
------------------------------
PATCH requests 
------------------------------
*/



// TODO: Perhaps return error if trying to patch id?
app.patch("/users/:id", function (request, response) {
    const body = request.body

    db.getUser(request.params.id).then(user => {
        for (key in user) { 
            if (body[key] != undefined) { // In the user object all values that matches a key of the body are replaced
                user[key] = body[key]
            }
        }

        response.status(201).json("User updated")
    }).catch(error => response.status(500).json("There was an error with PATCH users/" + request.params.id))
})



/*
-----------------------------------------
DELETE requests
------------------------------------------
*/

app.delete("/users/:id", function(request, response) {
    // TODO: Verify that correct permissions are provided in the request

    db.deleteUser(request.params.id).then(() =>
        response.status(204).json("User with ID " + request.params.id + " was deleted")
    ).catch(error => response.status(500).json("There was an error with DELETE users/" + request.params.id))
})
=======
