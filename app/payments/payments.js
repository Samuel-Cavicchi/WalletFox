db = require('../database.js');
const routes = require("express").Router();

// GET specific payment
routes.get("/:id", function (request, response) {
    const id = request.params.id
    db.getPayment(id).then(payment =>
        response.status(200).json(payment)
    ).catch(error => response.status(404).json(error.message))
})

module.exports = routes;
