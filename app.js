const express = require("express");
const routes = require("./app/routes.js");
const db = require("./app/database.js");
const bodyParser = require('body-parser') // TODO: Move this to a more fitting place after discussion

const app = express();
app.use(bodyParser.urlencoded({ extended: false })) // Set bodyparser to JSON? Need to look this up

// Re-route all paths to our routes.js file
app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
});