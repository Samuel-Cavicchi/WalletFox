const express = require("express");
const routes = require("./routes.js");
const db = require("./database.js");
const bodyParser = require('body-parser') // TODO: Move this to a more fitting place after discussion

const app = express();
app.use(bodyParser.urlencoded({ extended: false })) // Set bodyparser to JSON? Need to look this up

// Re-route all paths to our routing file
app.use("/", routes);


app.listen(8080, () => {
    console.log('Wallet Fox listening on port 8080'); // DELETE ON SUBMISSION
});

/*
----------------------------
GET requests
------------------------------
*/






/*
    End of functions to be removed
    -------------------------------------------------------------- !!!!
*/

app.get("/searchUsers/", function(request, response) {
    const body = request.body
    let foundUsers = []

    db.getUsers().then(users => {
        for (key in body) {
            foundUsers.push(users.filter(u => u[key] == body[key]))
        }
        console.log(foundUsers)
    })
})






// GET specific payment debt

/*
-------------------------------
POST requests
--------------------------------
*/



/* 
---------------------------------
PUT requests
--------------------------------
*/



/*
------------------------------
PATCH requests 
------------------------------
*/







/*
-----------------------------------------
DELETE requests
------------------------------------------
*/

