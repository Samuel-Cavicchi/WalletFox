const jwt = require('jsonwebtoken')
const routes = require("express").Router()
 
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