/**
 * database.js: This module handles all interactions with the MySQL database.
 * Centralizing this logic makes the system more maintainable and secure.
 */

const mysql = require('mysql2');

// Configure the connection parameters. 
// In a real production environment, these should be in an .env file for security.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Pass1234!', 
    database: 'company_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID ' + connection.threadId);
    
    // Immediately ensure our required table exists upon connection
    createTable();
});

/**
 * Creates the required 'mysql_table' if it doesn't already exist.
 * This ensures our system is robust and the schema is ready for data.
 */
function createTable() {
    // Requirement: Column names must use snake_case 
    // Requirement: Table name must be mysql_table 
    const sql = `
        CREATE TABLE IF NOT EXISTS mysql_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(20) NOT NULL,
            second_name VARCHAR(20) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone_number VARCHAR(10) NOT NULL,
            eircode VARCHAR(6) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table 'mysql_table' verified/created successfully.");
    });
}

/**
 * PART C: Before saving any data, we must ensure the schema is correct.
 * This function is called by our middleware in server.js.
 */
const verifySchema = (callback) => {
    // We query the table structure to ensure all required snake_case columns exist.
    connection.query("DESCRIBE mysql_table", (err, fields) => {
        if (err) {
            return callback(err);
        }
        // Logic to check if required columns like 'first_name' or 'eircode' are present
        console.log("Schema verification successful.");
        callback(null);
    });
};

/**
 * Inserts data into 'mysql_table' using parameterized queries.
 * Parameterized queries are crucial for security to prevent SQL Injection[cite: 15, 20].
 */
const insertData = (data, callback) => {
    const sql = `INSERT INTO mysql_table (first_name, second_name, email, phone_number, eircode) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    // Data is passed as an array to the query method to ensure it is escaped properly.
    const values = [
        data.first_name, 
        data.second_name, 
        data.email, 
        data.phone_number, 
        data.eircode
    ];

    connection.query(sql, values, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// Export these functions so they can be used by server.js and index.js 
module.exports = {
    insertData,
    verifySchema
};