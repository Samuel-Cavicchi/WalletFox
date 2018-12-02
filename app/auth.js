const jwt = require('jsonwebtoken')
const routes = require("express").Router();
const db = require('./database.js')

routes.get("", function(req, res) { // GET /auth
    const id = req.body.id
    const pass = req.body.password

    if(id) {
        db.getUser(id).then(user => {
            if(pass) {
                if(pass === user.password) {
                    const authToken = createToken(id)
                    res.status(200).json({token: authToken})
                } else {
                    res.status(400).json('Incorrect password')
                }
            } else {
                res.status(400).json('No password provided')
            }
        }).catch(err => {
            res.status(400).json(err) // User not found
        })
    } else {
        res.status(400).json('No ID provided')
    }
})


function createToken(userId) {
    var claims = {
        sub: userId,
        iss: 'localhost:8080'
    }
    var token = jwt.sign(claims, 'secret')
    console.log('Created token:', token)
    return token
}

function checkToken(token) {
    token = token.replace(/\"/g, '') // Remove any quotation marks left in token
    return new Promise(function(resolve, reject) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if(err) {
                console.log('error with token: ' + token + ' error: ' + err)
                reject(err)
            } else {
                console.log('checking token:', decoded)
                resolve(decoded)
            }
        })

    })
}

exports.createToken = createToken
exports.checkToken = checkToken
module.exports = routes