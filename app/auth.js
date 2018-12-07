const jwt = require('jsonwebtoken')
const routes = require("express").Router();
const db = require('./database.js')
const reqhandler = require('./request-handler')

routes.get("", function(req, res) { // GET /auth
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['id', 'password'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }
    const id = req.body.id
    const pass = req.body.password

        db.getUser(id).then(user => {
            console.log('user:', user)
            console.log('pass:', pass)
            if(pass == user.password) {
                const authToken = createToken(id)
                res.status(200).json({token: authToken})
            } else {
                res.status(400).json('Incorrect password')
            }
        }).catch(err => {
            res.status(400).json(err) // User not found
        })
})


function createToken(userId) {
    var claims = {
        sub: userId,
        iss: 'localhost:8080'
    }
    var token = jwt.sign(claims, 'secret')
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

module.exports = routes
module.exports.checkToken = checkToken
module.exports.createToken = createToken