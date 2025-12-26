/**
 * index.js: This file handles reading the CSV dataset.
 * It validates each row and only inserts valid data into the database.
 */

const fs = require('fs');
const csv = require('csv-parser');
const db = require('./database'); // Import our database logic

// Replace 'dataset.csv' with the actual name of your file
const csvFilePath = 'dataset.csv'; 

let rowNumber = 0; // To track and report the exact row number of any errors

console.log("Starting CSV processing...");

// We use 'fs.createReadStream' to read the file bit by bit (efficient for large files)
fs.createReadStream(csvFilePath)
    .pipe(csv()) // The 'pipe' function sends the file data into the CSV parser
    .on('data', (row) => {
        rowNumber++; // Increment row number for every line we read

        // --- PART A: Data Validation ---
        // We use the same rules from Part B to keep our data consistent.
        if (validateRow(row, rowNumber)) {
            // If valid, insert into 'mysql_table'
            // We ensure keys match the snake_case column names in our database
            const formattedData = {
                first_name: row.first_name,
                second_name: row.second_name,
                email: row.email,
                phone_number: row.phone_number,
                eircode: row.eircode
            };

            db.insertData(formattedData, (err) => {
                if (err) {
                    console.error(`Row ${rowNumber}: Database insertion failed.`, err.message);
                }
            });
        }
    })
    .on('end', () => {
        console.log('CSV file processing complete.');
    });

/**
 * Validates a single row of data from the CSV.
 * Requirement: If data is invalid, show an error message with the row number.
 */
function validateRow(row, rowNum) {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;

    // Check First Name
    if (!nameRegex.test(row.first_name) || row.first_name.length > 20) {
        console.error(`Row ${rowNum} Error: Invalid First Name (${row.first_name})`);
        return false;
    }

    // Check Second Name
    if (!nameRegex.test(row.second_name) || row.second_name.length > 20) {
        console.error(`Row ${rowNum} Error: Invalid Second Name (${row.second_name})`);
        return false;
    }

    // Check Email
    if (!emailRegex.test(row.email)) {
        console.error(`Row ${rowNum} Error: Invalid Email format (${row.email})`);
        return false;
    }

    // Check Phone Number
    if (!phoneRegex.test(row.phone_number)) {
        console.error(`Row ${rowNum} Error: Phone must be 10 digits (${row.phone_number})`);
        return false;
    }

    // Check Eircode
    if (!eircodeRegex.test(row.eircode)) {
        console.error(`Row ${rowNum} Error: Invalid Eircode format (${row.eircode})`);
        return false;
    }

    return true; // All checks passed!
}