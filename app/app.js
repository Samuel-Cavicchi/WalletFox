const express = require("express");
const routes = require("./routes.js");
const db = require("./database.js");

const app = express();

// Re-route all paths to our routing file
// app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
    func();
});

//test comment

// Requesting a specific user ID
app.get("/users/:id", function (request, response) {
    const id = request.params.id;
    db.getUser(id).then(function(user) {
        if (user) { // If wallet != null
            response.status(200).json(user); // Return the specific wallet with 200 OK
        } else {
            response.status(400).end(); // If wallet does not exist, return 400 Bad Request
        }
    })
})
