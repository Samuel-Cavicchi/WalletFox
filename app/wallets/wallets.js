db = require('../database.js');
const routes = require("express").Router();

routes.get("/:id", function (req, res) {
    res.status(200).json("Found wallets / id")
})

module.exports = routes;
