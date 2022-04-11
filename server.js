const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const res = require('express/lib/response');


const app = express(); // create new instance of express
const port = process.env.PORT || 4000; // start the server by telling it which port to use, using port 4000 on local environment; however, Heroku will assign port for app after deployment

app.use(cors({
    origin: ["http://localhost:3000", "https://wizardly-swartz-83a6f0.netlify.app/"],
    methods: ["GET", "POST"],
    credentials: true
}));

// Associate the modules we'll be using with Express
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
app.set('trust proxy', 1)
app.use(session({
    key: 'userID',
	secret: 'secret', // random unique string key used to authenticate a session, stored in environment variable and can't be exposed to public (usually long and randomly generated in a production environment)
    resave: false, // enables session to be stored back to session store, even if session was never modified during request
	saveUninitialized: false, // allows any uninitialized session to be sent to the store (when a session is created but not modified, is referred to as uninitialized)
    proxy: true,
    cookie: { 
        expires: oneDay 
    }
}));

// Parsing the incoming data
app.use(express.json());

// Serving public file
app.use(express.static(path.join(__dirname)));

// Cookie parser middleware
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

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

// Check if user is logged in
app.get('/auth', (req, res)=> {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
})

// Create an account
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

// Log in to an existing account
app.post('/auth', (req, res) => { // POST method captures input fields when user submits form
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM login_example WHERE username = ? AND password = ?', [username, password], 
        (err, result) => {
			// If there is an issue with the query, output the error
			if (err) {
                res.send({err: err})
            };
			// If the account exists
			if (result.length > 0) {
				// Authenticate the user
                req.session.user = result;
                console.log(req.session.user);
                res.send(result);
			} else {
				res.send({ message: 'Incorrect Username and/or Password!' });
			}			
			res.end();
		});
	} else {
		res.send({ message: 'Please enter Username and Password!' });
		res.end();
	}
});

// Log out of an account
app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
 });