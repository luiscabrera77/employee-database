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
          SELECT C.id AS id, department_name AS name, COUNT(A.first_name) AS headcount
          FROM employees AS A 
          LEFT JOIN roles
          ON A.role_id = roles.id 
          RIGHT JOIN departments AS C
          ON roles.department_id = C.id
          GROUP by C.id;  
          `
          );
        return data;
    }
    catch (error) {
        console.log("ERROR - in departments.js allDepartments(): " + error);
    }
  },

  departmentId: async department => {
    try {
      const data = await queryAsync(`SELECT id AS departmentId FROM departments WHERE department_name = '${department}'`);
      const departmentId = data[0].departmentId;
      return departmentId;
    }
    catch (error) {
      console.log("ERROR - in departments.js departmentId(): " + error);
  }
  }

}

module.exports = departmentQueries;

