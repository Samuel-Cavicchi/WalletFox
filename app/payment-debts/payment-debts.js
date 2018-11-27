db = require('../database.js');
const routes = require("express").Router();


routes.get("/:id", function (request, response) {
    const id = request.params.id
    db.getPaymentDebt(id).then(debt =>
        response.status(200).json(debt)
    ).catch(error => response.status(404).json(error.message))
})


module.exports = routes;
