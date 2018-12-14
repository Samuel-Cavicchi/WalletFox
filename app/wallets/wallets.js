db = require('../database.js')
auth = require('../auth.js')
reqhandler = require('../request-handler.js')
const routes = require("express").Router()

routes.post("", function (req, res) {
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token', 'currency', 'name'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token
    auth.checkToken(authToken).then(authorisedUser => {
        const walletToAdd = req.body
        db.addWallet(walletToAdd).then(result => { // Add a wallet
            db.addWalletMember(authorisedUser.sub, result.insertId, true).then(walletMember => { // Add the user as a wallet member
                res.setHeader('Location', '/wallets/' + result.insertId)
                res.status(201).json({ // Return the created wallet member
                    userId: authorisedUser.sub,
                    walletId: result.insertId, 
                    walletMemberId: walletMember.insertId
                })
            }).catch(() => {
                res.status(500).json("Error adding wallet-member")
            })
        }).catch(() => {
            res.status(500).json("Server error")
        })
    }).catch(()=> res.status(401).json("Bad token"))
})

// GET specific wallet
routes.get("/:id", function (req, res) {
    const id = req.params.id
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token
    auth.checkToken(authToken).then(authorisedUser => {
        db.getWallet(id, authorisedUser.sub).then(wallet => {
            if(wallet) {
                returnWallet = {
                    walletId: wallet.walletId,
                    name: wallet.name,
                    currency: wallet.currency
                }
                res.status(200).json(returnWallet)
            } else {
                res.status(404).json("Wallet not found")
            }
        }).catch(() => res.status(500).json("Server error"))
    }).catch(() => res.status(401).json("Bad token"))
})

routes.get("", function (req, res) {
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token
    auth.checkToken(authToken).then(authorisedUser => {
        db.getWallets(authorisedUser.sub).then(wallets => {
            res.status(200).json(wallets)
        }).catch(() => {
            res.status(500).json("Server error")
        })
    }).catch(() => res.status(401).json("Bad token"))
})

routes.patch("/:id", function (req, res) {
    id = req.params.id
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token
    auth.checkToken(authToken).then(authorisedUser => {
        db.getWallet(id, authorisedUser.sub).then(wallet => {
            if(wallet) {
                db.updateWallet(id, req.body).then(() => {
                    res.status(200).json("Updated wallet")
                }).catch(() => {
                    res.status(500).json("Server error")
                })
            } else {
                res.status(404).json("Wallet not found")
            }
        }).catch(err => res.status(500).json(err))
    }).catch(() => res.status(401).json("Bad token"))
})

routes.delete("/:id", function (req, res) {
    id = req.params.id
    const missingParameters = reqhandler.checkRequestParams({ request: req, requiredBody: ['token'], })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }

    const authToken = req.body.token
    auth.checkToken(authToken).then(authorisedUser => {
        db.getWallet(id, authorisedUser.sub).then(wallet => {
            if(wallet) {
                db.deleteWallet(id).then(() => {
                    res.status(200).json("Deleted wallet")
                }).catch(err => res.status(500).json(err))
            } else {
                res.status(500).json("Could not find wallet to delete")
            }
        }).catch(err => res.status(500).json(err))
    }).catch(() => res.status(401).json("Bad token"))
})


module.exports = routes
