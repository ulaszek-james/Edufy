const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ // #### is mysql password on local machine
    user: 'root',
    host: 'localhost',
    password: '####',
    database: 'edufyLogin',
});

app.post('/create', (req, res) => {
    console.log(req.body)
    const fName = req.body.fName;
    const lName = req.body.lName;
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO loginExample (fName, lName, username, password) VALUES (?,?,?,?)", 
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

app.listen(3001, ()=> {
    console.log("Server is running on port 3001")
})