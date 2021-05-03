// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const rolesQueries = {

  // All roles
  allRoles: async () => {
    try {
        const data = await queryAsync(
          `
          SELECT A.id, title, salary, B.department_name AS department
          FROM roles AS A
          LEFT JOIN departments AS B
          ON A.department_id = B.id 
          ORDER BY A.id;  
          `
          );
        return data;
    }
    catch (error) {
        console.log("ERROR - in role.js allRoles(): " + error);
    }
  },

  // Return Role by ID
  roleById: async role => {
  try {
      const data = await queryAsync(`
      SELECT id AS roleId FROM roles 
      WHERE title = '${role}'
      `);
      const roleId = data[0].roleId;
      return roleId;
    }
    catch (error) {
        console.log("Error in role.js roleById():  " + error);
    }
  }
}


module.exports = rolesQueries;