db = require('../database.js');
const routes = require("express").Router();

routes.post("", function (request, response) {
    const walletToAdd = request.body

    const wallets = db.getWallets().then(wallets => {
        walletToAdd.id = wallets[wallets.length - 1].id + 1
        db.addWallet(walletToAdd)
        response.status(201).json("Location: wallets/" + walletToAdd.id)
    }).catch(error => {
        response.status(500).end("There was an error with post/wallets :(")
    })
})

// GET specific wallet
routes.get("/:id", function (request, response) {
    const id = request.params.id
    db.getWallet(id).then(wallet =>
        response.status(200).json(wallet) // Return the specific wallet with 200 OK
    ).catch(error => response.status(404).json(error.message))
})

routes.get("", function (request, response) {
    db.getWallets().then(wallets => {
        response.status(200).json(wallets)
    }).catch(error => response.status(500).json(error.message))
})


module.exports = routes;
