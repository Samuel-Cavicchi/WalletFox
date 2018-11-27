db = require('../database.js');
const routes = require("express").Router();

// TODO: Perhaps return error if trying to patch id?
routes.patch("/:id", function (request, response) {
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

routes.delete("/:id", function(request, response) {
    // TODO: Verify that correct permissions are provided in the request

    db.deleteUser(request.params.id).then(() =>
        response.status(204).json("User with ID " + request.params.id + " was deleted")
    ).catch(error => response.status(500).json("There was an error with DELETE users/" + request.params.id))
})

// Requesting a specific user ID
routes.get("/:id", function (request, response) {
    const id = request.params.id
    db.getUser(id).then(user =>
        response.status(200).json(user) // Return the specific wallet with 200 OK
    ).catch(error => response.status(404).json(error.message))
})



routes.get("", function (request, response) {

    db.getUsers().then(users => 
        response.status(200).json(users) // Return all users
    ).catch(error => response.status(404).json(error.message))
})


routes.post("", function (request, response) {
    const userToAdd = request.body

    const users = db.getUsers().then(users => {
        userToAdd.id = users[users.length - 1].id + 1
        db.addUser(userToAdd)
        response.status(201).json("Location: users/" + userToAdd.id)
    }).catch(error => {
        response.status(500).end("There was an error with post/users :(")
    })
})

module.exports = routes;
