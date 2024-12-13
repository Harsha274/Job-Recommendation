const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // default MySQL user in XAMPP
    password: 'hhsql', // MySQL password (leave empty if not set)
    database: 'job_portal',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Endpoint to save approval letter
app.post('/save-approval-letter', (req, res) => {
    const { company_name, job_title, applicant_name, letter_content } = req.body;

    // Insert data into the approval_letters table
    const query = 'INSERT INTO approval_letters (company_name, job_title, applicant_name, approval_date, letter_content) VALUES (?, ?, ?, NOW(), ?)';
    
    db.query(query, [company_name, job_title, applicant_name, letter_content], (err, result) => {
        if (err) {
            console.error('Error saving approval letter:', err);
            res.status(500).send('Error saving approval letter');
            return;
        }
        res.status(200).send('Approval letter saved successfully');
    });
});

// Endpoint to fetch all approval letters
app.get('/get-approval-letters', (req, res) => {
    const query = 'SELECT * FROM approval_letters';
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching approval letters:', err);
            res.status(500).send('Error fetching approval letters');
            return;
        }
        res.status(200).json(result);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
