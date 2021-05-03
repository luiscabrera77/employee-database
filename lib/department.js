// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const departmentQueries = {

  // All employees in a department
  allDepartments: async () => {
    try {
        const data = await queryAsync(
          `
          SELECT id, department_name AS name
          FROM departments 
          ORDER BY id;  
          `
          );
        return data;
    }
    catch (error) {
        console.log("ERROR - in departments.js allDepartments(): " + error);
    }
  },
}

module.exports = departmentQueries;