db = require('../database.js');
auth = require('../auth.js');
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
    const authToken = request.query.token;
    if(authToken) {
        auth.checkToken().then(tokenData => {
            if(tokenData.sub === id) {
                // User has sufficient access for this information
            } else {
                // Another user is requesting this user's public information
            }
        }).catch(err => {
            response.status(401).json(err) // Bad auth token
        })
    } else {
        response.status(401).json('No auth token provided in query parameters') // No auth token
    }
    db.getUser(id).then(user =>
        response.status(200).json(user) // Return the specific wallet with 200 OK
    ).catch(error => response.status(404).json(error.message))
})



routes.get("", function (request, response) {

    db.getUsers().then(users => 
        response.status(200).json(users) // Return all users
    ).catch(error => response.status(404).json(error.message))
})

// Create a new user
routes.post("", function (req, res) {
    const userToAdd = req.body
    console.log('request body: ', req.body)
    // TODO: Check if all parameters are present
    db.addUser(userToAdd).then(result => {
        const userId = result.insertId;
        const token = auth.createToken(userId)
        res.setHeader('Location', '/users/' + userId)
        res.status(201).json(token)
    }).catch(error => {
        res.status(500).json(error)
    });
})

module.exports = routes;
