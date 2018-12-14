const routes = require("express").Router()

routes.get('/', (req, res) => {
    res.status(200).json("Welcome to WalletFox API")
})

routes.use('/users', require('./users/users.js'))
routes.use('/wallet-members', require('./wallet-members/wallet-members.js'))
routes.use('/wallets', require('./wallets/wallets.js'))
routes.use('/auth', require('./auth.js'))
module.exports = routes
