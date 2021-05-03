// Modules
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const util = require("util");
const { table, log } = require("console");

// Files
const questions = require("./lib/questions");
const Questions = questions.Questions;

// Database Connection
const db = require('./db/connection');

// SQL Queries
const globalQueries = require("./lib/global");
const employeeQueries = require("./lib/employee");
const departmentQueries = require("./lib/department");
const roleQueries = require("./lib/role");
const budgetQueries = require("./lib/budget");

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

// Main Menu of the app (First question left outside of constructor classes to insert Separators)
const mainMenu = {
  options: async () => {
    try {
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
              "Headcount and Budget by Department",
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
      switch(action) {
          case "All Employees":
            allEmployees();
            break;
          case "Employees by Department":
            employeesByDepartment();
            break;
          case "Employees by Manager":
            employeesByManager();
            break;
          case "All Departments":
            allDepartments();
            break;
          case "All Roles":
            allRoles();
            break;
          case "Headcount and Budget by Department":
            budgetByDepartment();
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

// FUNCTIONS FOR EACH CASE

// Get All Employees
async function allEmployees() {
  try {
    const employeesData = await employeeQueries.allEmployees();
    const employeesTable = cTable.getTable(employeesData);
    console.log("\nFull list of employees:\n\n" + employeesTable);
    mainMenu.options();
  }
  catch (error) {
    console.log("Error in index.js allEmployees(): " + error);
  }
}

// Get Employees by Department LOGIC IS ONLY EXPLAINED HERE!
async function employeesByDepartment() {
  try {
    // Get Department Names and set them as choices
    Questions.Departments.choices = await globalQueries.selectTableCol("department_name", "departments");      
    // Present departments
    const { department_name } = await inquirer.prompt(Questions.Departments.returnString());
    // Get Employees on selected department
    const employeesInDepartment = await employeeQueries.employeesInDepartment(department_name);
    // Get employees
    const employeesInDepartmentTable = cTable.getTable(employeesInDepartment);
    // Show employees
    console.log(`\nEmployees in the ${department_name} department:\n\n` + employeesInDepartmentTable);
    // Go back to main Menu
    mainMenu.options();
  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js employeesByDepartment(): " + error);
  }
}

// Get Employees by Manager
async function employeesByManager() {
  try {
    Questions.Managers.choices = await employeeQueries.allManagers();
    const { manager_name } = await inquirer.prompt(Questions.Managers.returnString());
    const employeesUnderManager = await employeeQueries.employeesbyManager(manager_name);
    const employeesUnderManagerTable = cTable.getTable(employeesUnderManager);
    console.log(`\nDirect reports of ${manager_name}:\n\n` + employeesUnderManagerTable);
    mainMenu.options();
  }
  catch (error) {
    console.log("Error in index.js employeesByManager(): " + error);
  }
}

// Get All Departments
async function allDepartments() {
  try {
    const departments = await departmentQueries.allDepartments();
    const departmentsTable = cTable.getTable(departments);
    console.log(`\nList of all departments:\n\n` + departmentsTable);
    mainMenu.options();
  }
  catch (error) {
    console.log("Error in index.js allDepartments(): " + error);
  }
}

// Get All Roles
async function allRoles() {
  try {
    const roles = await roleQueries.allRoles();
    const rolesTable = cTable.getTable(roles);
    console.log(`\nList of all roles:\n\n` + rolesTable);
    mainMenu.options();
  }
  catch (error) {
    console.log("Error in index.js allRoles(): " + error);
  }
}

// Headcount and Budget by Department
async function budgetByDepartment() {
  try {
    const budget = await budgetQueries.budgetByDepartment();
    const budgetTable = cTable.getTable(budget);
    console.log(`\nHeadcount and budget by Department:\n\n` + budgetTable);
    mainMenu.options();
  }
  catch (error) {
    console.log("Error in index.js budgetByDepartment(): " + error);
  }
}

// Update Employee Role
async function updateEmployeeRole() {
  try {
    Questions.EmployeeNewRole1.choices = await employeeQueries.employeeList();            
    Questions.EmployeeNewRole2.choices = await globalQueries.selectTableCol("title", "roles");
    const { employee } = await inquirer.prompt(Questions.EmployeeNewRole1.returnString());
    const { role } = await inquirer.prompt(Questions.EmployeeNewRole2.returnString());
    const employeeId = await employeeQueries.employeeId(employee);
    const roleId = await roleQueries.roleById(role);
    const updateEmployee = await globalQueries.updateRecord("employees", "role_id", roleId, "id", employeeId);
    console.log(`\nRole of ${employee} successfully updated to ${role}.\nVerify update below:`);
    allEmployees();
  }
  catch (error) {
    console.log("Error in index.js updateEmployeeRole(): " + error);
  }
}

// Update Employee Manager
async function updateEmployeeManager() {
  try {
    Questions.EmployeeNewManager1.choices = await employeeQueries.employeeList();
    Questions.EmployeeNewManager2.choices = Questions.EmployeeNewManager1.choices;
    const { employee } = await inquirer.prompt(Questions.EmployeeNewManager1.returnString());
    const { manager } = await inquirer.prompt(Questions.EmployeeNewManager2.returnString());
    const employeeId = await employeeQueries.employeeId(employee);
    const managerId = await employeeQueries.employeeId(manager);
    const updateEmployee = await globalQueries.updateRecord("employees", "manager_id", managerId, "id", employeeId);
    console.log(`\n${employee}'s manager was successfully updated to ${manager}\nVerify update below:`);
    allEmployees();
  }
  catch (error) {
    console.log("Error in index.js updateEmployeeManager(): " + error);
  }
}

// New Employee
async function addEmployee() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js addEmployee(): " + error);
  }
}

// Delete Employee
async function removeEmployee() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js removeEmployee(): " + error);
  }
}



// New Department
async function addDepartment() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js addDepartment(): " + error);
  }
}

// Delete Department
async function removeDepartment() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js removeDepartment(): " + error);
  }
}



// New Role
async function addRole() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js addRole(): " + error);
  }
}

// Delete Role
async function removeRole() {
  try {

  }
  catch (error) {
    // Specify where the error occurred
    console.log("Error in index.js removeRole(): " + error);
  }
}

function exit() {
  db.end();
  console.log("\n\nConnection closed. Good bye!\n\n");
}

start();