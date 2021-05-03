// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const budgetQueries = {

  // Budget by Department
  budgetByDepartment: async () => {
    try {
        const data = await queryAsync(
          `
          SELECT department_name AS department, COUNT(*) AS employees, SUM(salary) AS total_salaries
          FROM employees AS A
          LEFT JOIN roles 
          ON A.role_id = roles.id
          LEFT JOIN departments
          ON roles.department_id = departments.id
          GROUP BY department_name
          ORDER BY total_salaries DESC;  
          `
          );
        return data;
    }
    catch (error) {
        console.log("ERROR - in role.js allRoles(): " + error);
    }
  },
}

module.exports = budgetQueries;