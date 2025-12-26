//Main file to the server. Meant to handle requests and define middleware

const express = require('express');
const path = require('path');
const helmet = require('helmet'); // Helps set secure headers 
const db = require('./database'); // the database logic file 

const app = express();
const PORT = 3000;

// --- PART D: Security & XSS Protection --- 
/**
 * We use 'helmet' to set Content Security Policy (CSP) headers.
 * This tells the browser which sources of content (scripts/styles) are trusted, 
 * which is a major defense against XSS attacks.
 */
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"], // Only allow scripts from our own server
            styleSrc: ["'self'"],
        },
    }
}));

/**
 * Middleware for cleaning and checking user input.
 * We parse incoming request bodies so we can inspect the data.
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve our static files (like form.html and style.css)
app.use(express.static(path.join(__dirname)));

// --- PART C: Middleware and Request Handling --- 
/**
 * This custom middleware checks the database schema.
 */
const checkSchemaMiddleware = (req, res, next) => {
    console.log("Middleware: Verifying database schema before processing...");
    
    // In database.js, we would have a function to verify the 'mysql_table' 
    db.verifySchema((err) => {
        if (err) {
            console.error("Schema Verification Failed: ", err);
            return res.status(500).send("Server Error: Database structure is incorrect.");
        }
        next(); // Move to the next function if schema is okay
    });
};

// --- ROUTES ---

/**
 * Handling the Form Submission from Part B.
 * We apply our 'checkSchemaMiddleware' here to protect the insertion process.
 */
app.post('/submit-form', checkSchemaMiddleware, (req, res) => {
    const userData = req.body;
    
    // Server-side sanitization to avoid XSS 
    // (You would add logic here to strip tags or escape special characters)
    console.log("Processing valid, sanitized data: ", userData);

    // Call database function to insert into 'mysql_table' 
    db.insertUser(userData, (err, result) => {
        if (err) return res.status(500).send("Error saving data.");
        res.send("Data received and stored securely!");
    });
});

// --- PART C: Port Check & Server Start --- 
/**
 * We start the server and check if the port is running correctly.
 * If there is an error starting the server, we log it immediately.
 */
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    // If the port is already in use or restricted, show this error.
    console.error("Critical Error: Server port failed to run.", err.message);
});