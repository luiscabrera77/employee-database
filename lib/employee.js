// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const employeeQueries = {

  // Full list of employees
  allEmployees: async () => {
    try {
        const data = await queryAsync(`
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
        `);
        return data;
    }
    catch (error) {
        console.log("Error in employee.js allEmployees():  " + error);
    }
  },

  // Simple list of employees
  employeeList: async () => {
    try {
        const data = await queryAsync(`
        SELECT CONCAT (first_name,' ', last_name) AS name
        FROM employees  
        ORDER BY name;
        `);
        const dataList = data.map(employee => employee.name);
        return dataList;
    }
    catch (error) {
        console.log("Error in employee.js employeeList():  " + error);
    }
  },

  // Return Employee by ID
  employeeId: async employee => {
    try {
      const data = await queryAsync(`
        SELECT id FROM employees 
        WHERE CONCAT(first_name, ' ', last_name) = '${employee}'
        `);
      const employeeId = data[0].id;
      return employeeId;
    }
    catch (error) {
        console.log("Error in employee.js employeeById():  " + error);
    }
  },

  // Employees by Department
  employeesInDepartment: async department => {
    try {
        const data = await queryAsync(`
          SELECT A.id, A.first_name, A.last_name, title, salary,
          CONCAT(B.first_name, ' ', B.last_name) AS manager
          FROM employees AS A
          LEFT JOIN employees AS B 
          ON A.manager_id = B.id  
          LEFT JOIN roles 
          ON A.role_id = roles.id  
          LEFT JOIN departments 
          ON roles.department_id = departments.id
          WHERE departments.department_name = '${department}' 
          ORDER BY A.id;  
          `);
        return data;
    }
    catch (error) {
        console.log("Error in employee.js employeesInDepartment(): " + error);
    }
  },

  // Get Managers
  allManagers: async () => {
    try {
        const data = await queryAsync(`
        SELECT DISTINCT CONCAT(B.first_name, ' ', B.last_name) AS name 
        FROM employees AS A 
        INNER JOIN employees AS B 
        ON A.manager_id = B.id;
        `);
        const dataList = data.map(manager => manager.name);
        return dataList;
    }
    catch (error) {
        console.log("Error in employee.js allManagers(): " + error);
    }
},

  // Employees by Manager
  employeesbyManager: async manager => {
    try {
        const data = await queryAsync(`
        SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary
        FROM employees AS A
        LEFT JOIN employees AS B 
        ON A.manager_id = B.id 
        LEFT JOIN roles 
        ON A.role_id = roles.id 
        LEFT JOIN departments 
        ON roles.department_id = departments.id 
        WHERE CONCAT(B.first_name, ' ', B.last_name) = '${manager}'
        `);
        return data;
    }
    catch (error) {
        console.log("Error in employee.js employeesbyManager(): " + error);
    }
  },

}

module.exports = employeeQueries;