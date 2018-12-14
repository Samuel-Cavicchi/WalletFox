const express = require("express");
const routes = require("./app/routes.js");
const db = require("./app/database.js");
const bodyParser = require('body-parser') // TODO: Move this to a more fitting place after discussion
var port = process.env.PORT || 8080

const app = express();
app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: false })) // Set bodyparser to JSON? Need to look this up

// Re-route all paths to our routes.js file
app.use("/", routes);


app.listen(port, () => {
    console.log('Wallet Fox listening on port:', port); // DELETE ON SUBMISSION
})