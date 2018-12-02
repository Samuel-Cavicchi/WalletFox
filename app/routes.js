/* 
Routes.js redirects all app routes to the correct route
*/

const routes = require("express").Router();

routes.get('/', (req, res) => {
    res.status(200).json("Welcome to WalletFox API")
});

//routes.get('/users', users);
routes.use('/users', require('./users/users.js'))
routes.use('/wallets', require('./wallets/wallets.js'))
routes.use('/wallet-debts', require('./wallet-debts/wallet-debts.js'))
routes.use('/payments', require('./payments/payments.js'))
routes.use('/payment-debts', require('./payment-debts/payment-debts.js'))
routes.use('/auth', require('./auth.js'))
module.exports = routes;
