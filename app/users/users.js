db = require('../database.js');
auth = require('../auth.js');
reqhandler = require('../request-handler.js');
const routes = require("express").Router();

// TODO: Perhaps return error if trying to patch id?
routes.patch("/:id", function (req, res) {
    const body = req.body
    const id = req.params.id
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    auth.checkToken(req.body.token).then(authorisedUser => {
        if (authorisedUser.sub == id) { // If the authorised user is the same user being accessed
            db.getUser(id).then(user => {
                for (key in user) {
                    if (body[key] != undefined) { // In the user object all values that matches a key of the body are replaced
                        user[key] = body[key]
                    }
                }
                db.updateUser(id, user).then(() => {
                    res.status(201).json("User updated")
                }).catch(() => res.status(500).json("Server error")) // There was an issue updating the user
            }).catch(error => res.status(500).json("Server error")) // There was an issue finding the user
        } else {
            res.status(401).json("Unauthorised")
        }
    }).catch(() => {
        res.status(401).json("Bad token")
        return
    })

})

// Delete a specific user
routes.delete("/:id", function (req, res) {
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }
    const id = req.params.id
    auth.checkToken(req.body.token).then(authorisedUser => {
        if (authorisedUser.sub == id) {
            db.getUser(id).then(user => {
                if (user) {
                    db.deleteUser(id).then(() =>
                        res.status(200).json("User with ID " + id + " was deleted")
                    ).catch(() => res.status(500).json("Server error"))
                } else {
                    res.status(404).json("User not found")
                }
            }).catch(() => res.status(500).json("Server error"))
        } else {
            res.status(401).json("Unauthorised")
        }
    }).catch(() => res.status(401).json("Bad token"))
})

// Requesting a specific user ID
routes.get("/:id", function (req, res) {
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token;
    const id = req.params.id
    auth.checkToken(authToken).then(authorisedUser => {
        db.getUser(id).then(user => {
            if (user) {
                delete user.password
                if (!authorisedUser.sub === id) { // Another user is requesting this user's public information
                    delete user.email
                }
                res.status(200).json(user)
            } else {
                res.status(404).json("User not found")
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json("Server error")
        })
    }).catch(() => {
        res.status(401).json("Bad token")
    })
})



routes.get("", function (req, res) {
    db.getUsers(req.query.name).then(users => {
        users.forEach(function (user) { // Remove sensitive data
            delete user.password
            delete user.email
        })
        res.status(200).json(users) // Return all users
    }).catch(error => res.status(404).json(error.message))
})

// Create a new user
routes.post("", function (req, res) {
    const userToAdd = req.body
    const missingParameters = reqhandler.checkRequestParams({ requiredBody: ['email', 'password', 'name'], request: req })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    db.addUser(userToAdd).then(result => {
        const userId = result.insertId;
        const token = auth.createToken(userId)
        res.setHeader('Location', '/users/' + userId)
        res.status(201).json(token)
        return
    }).catch(error => {
        res.status(500).json(error)
        return
    });
})

module.exports = routes;
