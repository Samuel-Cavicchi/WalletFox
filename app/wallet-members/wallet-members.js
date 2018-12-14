db = require('../database.js')
auth = require('../auth.js')
reqhandler = require('../request-handler.js')
const routes = require("express").Router()

routes.get("/:id", function (req, res) {
    const id = req.params.id
    db.getWalletMember(id).then(walletMember => {
        if (walletMember) {
            res.status(200).json(walletMember)
        } else {
            res.status(404).json("Wallet Member not found")
        }
    }).catch(() => {
        res.status(500).json("Server error")
    })
})

// Create a new wallet member
routes.post("", function (req, res) {
    const missingParameters = reqhandler.checkRequestParams({ requiredBody: ['token', 'userId', 'walletId'], request: req })
    if (missingParameters) {
        res.status(400).json(missingParameters)
        return
    }
    auth.checkToken(req.body.token).then(authorisedUser => {
        db.getWallet(req.body.walletId, authorisedUser.sub).then(wallet => {
            if(wallet) {
                db.addWalletMember(req.body.userId, req.body.walletId).then(result => {
                    res.setHeader('Location', '/wallet-members/' + result.insertId)
                    res.status(201).json("Created wallet member")
                    return
                }).catch(error => {
                    res.status(500).json(error)
                    return
                })
            } else {
                res.status(404).json("Could not find wallet")
            }
        })
    }).catch(() => res.status(401).json("Bad token"))
})
module.exports = routes
