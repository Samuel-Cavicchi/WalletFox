db = require('../database.js');
const routes = require("express").Router();

routes.get("/:id", function (req, res) {
    res.status(200).json("Found payment debts / id")
})

module.exports = routes;
