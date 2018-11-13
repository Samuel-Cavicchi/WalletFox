const express = require("express");
const routes = require("./routes.js");
const db = require("./database.js");

const app = express();

// Re-route all paths to our routing file
app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
});

