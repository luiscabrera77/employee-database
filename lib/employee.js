// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

function allEmployees () {
  const data = (
    `
    SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary, 
    CONCAT(B.first_name, ' ', B.last_name) AS manager
    FROM employees AS A 
    LEFT JOIN employees AS B 
    ON A.manager_id = B.id 
    LEFT JOIN roles 
    ON A.role_id = roles.id  
    LEFT JOIN departments 
    ON roles.department_id = departments.id 
    ORDER BY A.id;
    `
    );
    return data;
}

module.exports = {allEmployees}