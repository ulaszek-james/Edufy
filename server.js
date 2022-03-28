const path = require('path');

const express = require('express'); // import express
const app = express(); // create new instance of express
const port = process.env.PORT || 3000; // start the server by telling it which port to use, using port 3000 on local environment; however, Heroku will assign port for app after deployment
const mysql = require('mysql')
const cors = require('cors')

const publicPath = path.join(__dirname, '..', 'client/public'); // pass in all pieces of the path and path.join puts them together
app.use(express.static(publicPath)); // previous line result passed into here so Express knows which files to serve

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {

    res.status(200).json({
        status: 'success',
        data: {
            name: 'edufy-by-edufiers',
            version: '0.1.0'
        }
    });

});

const db = mysql.createConnection({
    user: "b0df76319fd66a",
    host: "us-cdbr-east-05.cleardb.net",
    password: "78c0a726",
    database: "heroku_1bc510ffc4c3a1d",
});

app.post('/create', (req, res) => {
    console.log(req.body)
    const fName = req.body.fName;
    const lName = req.body.lName;
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO login_example (fName, lName, username, password) VALUES (?,?,?,?)", 
        [fName,lName,username,password], 
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Credentials Recorded");
            }
        }
    );
})

// This is maybe needed for tests

// app.get('/get', (req, res) => {
//     console.log(req.body)
//     const username = req.body.username;

//     db.query(
//         "SELECT username FROM login_example (username) VALUES (?)",
//         [username],
//         (err, result) => {
//             if (err) {
//                 res.send("Valid username");
//             } else {
//                 console.log(err);
//             }
//         }
//     );
// })

export default app