-- Create the database
CREATE DATABASE IF NOT EXISTS CA2_ssp;

-- Switch to using this database
USE CA2_ssp;

CREATE TABLE IF NOT EXISTS mysql_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    second_name VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    eircode VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);