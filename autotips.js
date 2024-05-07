// We connect the necessary dependencies
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Creating an Express Application
const app = express();
const port = 3000;

// Initializing the SQLite database
const db = new sqlite3.Database('schedule.db');

// Create a schedule table (if it does not exist)
db.run(`CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT,
    time TEXT
)`);

// Setting up middleware to process POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Displaying an HTML form for entering a task and time
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Processing a POST request to add a task to the schedule
app.post('/addTask', (req, res) => {
    const task = req.body.task;
    const time = req.body.time;
    db.run(`INSERT INTO schedule (task, time) VALUES (?, ?)`, [task, time], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Task "${task}" added to schedule at ${time}`);
        res.redirect('/');
    });
});

// Displaying all tasks from the schedule
app.get('/schedule', (req, res) => {
    db.all(`SELECT * FROM schedule`, (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });
});

// We start the server on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});