const express = require("express")
const routes = require("./app/routes.js")
const db = require("./app/database.js")
const bodyParser = require('body-parser')

const app = express()
app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: false }))

// Re-route all paths to our routes.js file
app.use("/", routes)


app.listen(process.env.PORT || 8080)