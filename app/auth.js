const jwt = require('jsonwebtoken')
const routes = require("express").Router();
const db = require('./database.js')
const reqhandler = require('./request-handler')
const request = require('request')

routes.get("/google-response", function(req, res) { // Response url for google or login 
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredQuery: ['code'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }
    const code = req.query.code
    getIdTokenFromGoogle(code)
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

routes.get("/google", function(req, res) { // Login to existing user with google response
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredQuery: ['code'], requiredBody: ['id'] })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }
    const code = req.query.code
    getIdTokenFromGoogle(code).then(code => {
        jwt.verify(token, (err, decoded) => {
            if(err) {
                res.status(400).json('error with google token: ' + token + ' error: ' + err)
            } else {
                console.log('Decoded google token: ', decoded)
                db.getUserByGoogleId(decoded.aud).then(user => {
                    if(user) {
                        const authToken = createToken(user.id)
                        res.status(200).json({token: authToken})
                    } else {
                        res.status(400).json('Incorrect password')
                    }
                }).catch(err => {
                    res.status(400).json(err) // User not found
                })
            }
        })
    })

})

function getIdTokenFromGoogle(code) {
    var clientServerOptions = {
        uri: 'https://www.googleapis.com/oauth2/v4/token',
        method: 'POST',
        body: {
            code: code,
            client_id,
            client_secret,
            redirect_uri,
            grant_type: authorization_code
        }
    }
    return new Promise( function( resolve, reject) {
        request(clientServerOptions, function (error, response) {
            if(error) {
                console.log('Error communicating with google: ', error.response)
                reject()
            } else {
                console.log('JWT from google: ', response.body.id_token)
                resolve(response.body.id_token)
            }
        });

    })
}

routes.get("/google-redirect", function(req, res) {
    const clientId;
    const redirectURI;
    var redirectUrl = `
    https://accounts.google.com/o/oauth2/v2/auth?
    client_id=`+clientId+`&
    redirect_uri=`+redirectURI+`&
    response_type=code&
    scope=openid`
    res.redirect(redirectUrl)
})

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