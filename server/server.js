const path = require('path');

const express = require('express'); // import express
const app = express(); // create new instance of express
const port = process.env.PORT || 3000; // start the server by telling it which port to use, using port 3000 on local environment; however, Heroku will assign port for app after deployment
const mysql = require('mysql')
const cors = require('cors')

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

// Get all quiz questions
app.get('/questions', (req, res) => {
    const sqlSelect = "SELECT * FROM quiz_example";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

// Get one quiz question
app.get('/questions/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM quiz_example WHERE questionNumber = " + id;

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
})

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

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
 });