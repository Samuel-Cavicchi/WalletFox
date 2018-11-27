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
    ------------------------------------------------------ !!!!
    !!! These requests are for troubleshooting, and are to be removed before submitting the code !!!
    TODO: remove this unless we can find a good reason to keep them. If not it's a security risk
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
            users.filter(u => {
                if(u[key] == body[key]) {
                    foundUsers.push(u);
                }
            })
            // foundUsers.push(users.filter(u => u[key] == body[key]))
        }
        foundUsers
        console.log('found users: ', foundUsers)
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

