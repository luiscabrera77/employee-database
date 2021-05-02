// Modules
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const util = require("util");
const { table, log } = require("console");

// Database Connection
const db = require('./db/connection');

// Files
const questions = require("./lib/questions");
const Questions = questions.Questions;

const globalQueries = require("./lib/global");
const departmentQueries = require("./lib/departments");
//const employeeQueries = require("./lib/employee");

let error = "";

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

// Create the initial connection and start the app
function start() {
    db.connect(function(err) {
        if (err) console.error(err);
        console.log("Connected to Database");
        mainMenu.options();
    })
}

const mainMenu = {
  options: async () => {
    try {
        // What would you like to do?
        const { action } = await inquirer.prompt({
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: [
              new inquirer.Separator('VIEW...'),
              "All Employees",
              "Employees by Department",
              "Employees by Manager",
              "All Departments",
              "All Roles",
              "★★★ (NEW!) Budget by Department ★★★",
              new inquirer.Separator('UPDATE...'),
              "Update Employee Role",
              "Update Employee Manager",
              new inquirer.Separator('ADD NEW...'),
              "New Employee",
              "New Department",
              "New Role",
              new inquirer.Separator('DELETE...'),
              "Delete Employee",
              "Delete Department",
              "Delete Role",
              "EXIT [X]"
          ]
      });

      // Handle the various cases - do different functions
      switch(action) {
          case "All Employees":
            Employees.allEmployees();
            break;
          case "Employees by Department":
            employeesByDepartment();
            break;
          case "Employees by Manager":
            Employees.employeesByManager();
            break;
          case "All Departments":
            Departments.allDepartments();
            break;
          case "All Roles":
            Roles.allRoles();
            break;
          case "★★★ (NEW!) Budget by Department ★★★":
            Budget.allBudget();
            break;
          case "Update Employee Role":
              updateEmployeeRole();
              break;
          case "Update Employee Manager":
              updateEmployeeManager();
              break;
          case "New Employee":
              addEmployee();
              break;
          case "New Department":
              addDepartment();
              break;
          case "New Role":
              addRole();
              break;
          case "Delete Employee":
              removeEmployee();
              break;
          case "Delete Department":
              removeDepartment();
              break;
          case "Delete Role":
              removeRole();
              break;
          case "EXIT [X]":
              exit();
      }
  }
  catch (error) {
      console.log("Something is wrong: " + error);
  }
}
}

// EMPLOYEES
const Employees = {

  // Get All Employees
  allEmployees: async () => {
    try {
      const data = await queryAsync(
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
      const table = cTable.getTable(data);
      console.log("\nFull list of employees:\n\n" + table);
      mainMenu.options();
    }
    catch (error) {
      console.log("ERROR: " + error);
    }
  },

  // Get Employees by Manager
  employeesByManager: async () => {
    try {
      const data = await queryAsync(
        `
        SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary
        FROM employees AS A 
        LEFT JOIN roles 
        ON A.role_id = roles.id  
        LEFT JOIN departments 
        ON roles.department_id = departments.id
        WHERE manager_id = 3 
        ORDER BY A.id;
        `
      );
      const table = cTable.getTable(data);
      console.log("\nManager's direct reports:\n\n" + table);
      mainMenu.options();
    }
    catch (error) {
      console.log("ERROR: " + error);
    }
  },

  // Update Employee Role

  // Update Employee Manager

  // New Employee

  // Delete Employee

}

async function employeesByDepartment() {
  try {
      // Get Department Names and set them as choices
      Questions.Departments.choices = await globalQueries.selectTableCol("department_name", "departments");      
      // Present departments
      const { department_name } = await inquirer.prompt(Questions.Departments.returnString());
      // Get Employees on selected department
      const employeesInDepartment = await departmentQueries.employeesInDepartment(department_name);
      // Show employees
      const employeesInDepartmentTable = cTable.getTable(employeesInDepartment);
      console.log(`\nList of employees in the ${department_name} department:\n\n` + employeesInDepartmentTable);
      // Go back to main Menu
      mainMenu.options();
  }
  catch (error) {
      // Specify where the error occurred
      console.log("ERROR - app.js - viewEmployeesByDepartment(): " + error);
  }
}

// DEPARTMENTS
const Departments = {

  // Get All Departments
  allDepartments: async () => {
    try {
      const data = await queryAsync(
        `
        SELECT * FROM departments ORDER BY id;  
        `
      );
      const table = cTable.getTable(data);
      console.log("\nFull list of departments:\n\n" + table);
      mainMenu.options();
    }
    catch (error) {
      console.log("ERROR: " + error);
    }
  },

  // New Department

  // Delete Department

}

// ROLES
const Roles = {

  // Get All Roles
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
      const table = cTable.getTable(data);
      console.log("\nFull list of Roles:\n\n" + table);
      mainMenu.options();
    }
    catch (error) {
      console.log("ERROR: " + error);
    }
  },

  // New Role

  // Delete Role

}

// BUDGET
const Budget = {

  // Get All Roles
  allBudget: async () => {
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
      const table = cTable.getTable(data);
      console.log("\nHeadcount and Budget by Department\n\n" + table);
      mainMenu.options();
    }
    catch (error) {
      console.log("ERROR: " + error);
    }
  },
}

// Displays exit message and ends database connection 
function exit() {
  db.end();
  console.log("Connection closed. Good bye!\n\n");
}

start();