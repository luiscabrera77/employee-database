// Modules
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const util = require("util");
//const { table, log } = require("console");

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
        console.log("                       _                       \n   ___ _ __ ___  _ __ | | ___  _   _  ___  ___ \n  / _ \\ '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\\n |  __/ | | | | | |_) | | (_) | |_| |  __/  __/\n  \\___|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|\n                |_|            |___/           \n  _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ \n | '_ ` _ \\ / _` | '_ \\ / _` |/ _` |/ _ \\ '__|\n | | | | | | (_| | | | | (_| | (_| |  __/ |   \n |_| |_| |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   \n                              |___/           \n");
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
              "Update Role Department",
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
          case "Update Role Department":
            updateRoleDepartment();
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
    // If array is empty, say it
    if (employeesInDepartment=="") {
      console.log(`No one works in ${department_name} \n\n`);
      mainMenu.options();
    }
    else {
    // Show employees
    console.log(`\nEmployees in the ${department_name} department:\n\n` + employeesInDepartmentTable);
    // Go back to main Menu
    mainMenu.options();
    }
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

// Update Role Department
async function updateRoleDepartment() {
  try {
    Questions.RoleNewDepartment.choices = await globalQueries.selectTableCol("title", "roles");            
    Questions.Departments.choices = await globalQueries.selectTableCol("department_name", "departments");
    const { role } = await inquirer.prompt(Questions.RoleNewDepartment.returnString());
    const { department_name } = await inquirer.prompt(Questions.Departments.returnString());
    const roleId = await roleQueries.roleById(role);
    const departmentId = await departmentQueries.departmentId(department_name);                    
    const updateRole = await globalQueries.updateRecord("roles", "department_id", departmentId, "id", roleId);
    console.log(`\nRole ${role} successfully moved to ${department_name}.\nVerify update below:`);
    allRoles();
  }
  catch (error) {
    console.log("Error in index.js updateRoleDepartment(): " + error);
  }
}

// New Employee
async function addEmployee() {
  try {
    Questions.NewEmployeeRole.choices = await globalQueries.selectTableCol("title", "roles");
    Questions.NewEmployeeManager.choices = await employeeQueries.employeeList();
    Questions.NewEmployeeManager.choices.push("No manager"); //Adding a 'no manager' option
    const newEmployee = await inquirer.prompt([Questions.NewEmployeeFirst.returnString(), Questions.NewEmployeeLast.returnString(), Questions.NewEmployeeRole.returnString(), Questions.NewEmployeeManager.returnString()]);
    newEmployee.roleId = await roleQueries.roleById(newEmployee.role);
    if (newEmployee.manager === "No manager") {
        newEmployee.managerId = null;
    }
    else {
        newEmployee.managerId = await employeeQueries.employeeId(newEmployee.manager);
    }
    const colValues = {
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        role_id: newEmployee.roleId,
        manager_id: newEmployee.managerId
    };
    const addEmployee = await globalQueries.insertRecord("employees", colValues);
    console.log(`\n${newEmployee.first_name} ${newEmployee.last_name} has been added. \nVerify update below:`);
    allEmployees();
  }
  catch (error) {
    console.log("Error in index.js addEmployee(): " + error);
  }
}

// New Department
async function addDepartment() {
  try {
    const { department_name } = await inquirer.prompt(Questions.NewDepartment.returnString());                    
    const colValues = {department_name:department_name};  
    const addDepartment = await globalQueries.insertRecord("departments", colValues);
    console.log(`\nThe new ${department_name} department was successfully added\nVerify update below:`);
    allDepartments();
  }
  catch (error) {
    console.log("Error in index.js addDepartment(): " + error);
  }
}

// New Role
async function addRole() {
  try {
    Questions.NewRoleDepartment.choices = await globalQueries.selectTableCol("department_name", "departments");
    const newRole = await inquirer.prompt([Questions.NewRoleTitle.returnString(), Questions.NewRoleSalary.returnString(), Questions.NewRoleDepartment.returnString()]);
    newRole.departmentId = await departmentQueries.departmentId(newRole.department);            
    const colValues = {
        title: newRole.title,
        salary: newRole.salary,
        department_id: newRole.departmentId
    };    
    const addRole = await globalQueries.insertRecord("roles", colValues);
    console.log(`\nThe new role ${newRole.title} was successfully added\nVerify update below:`);
    allRoles();
  }
  catch (error) {
    console.log("Error in index.js addRole(): " + error);
  }
}

// Delete Employee
async function removeEmployee() {
  try {
    // Query the database for employees. Use employees as question choices
    Questions.DeleteEmployee.choices = await employeeQueries.employeeList();
    const { employee } = await inquirer.prompt(Questions.DeleteEmployee.returnString());
    const { confirmYN } = await inquirer.prompt(Questions.DeleteConfirm.returnString());
    if (confirmYN === "Yes") {
        const employeeId = await employeeQueries.employeeId(employee);
        const deleteEmployee = await globalQueries.deleteRecord("employees", "id", employeeId);
        console.log(`\n${employee} has been deleted.\nVerify update below:`);
        allEmployees();
    }
    else {
      mainMenu.options();
    }
  }
  catch (error) {
    console.log("Error in index.js removeEmployee(): " + error);
  }
}

// Delete Department
async function removeDepartment() {
  try {
    Questions.DeleteDepartment.choices = await globalQueries.selectTableCol("department_name", "departments");
    const { department } = await inquirer.prompt(Questions.DeleteDepartment.returnString());    
    const { confirmYN } = await inquirer.prompt(Questions.DeleteConfirm.returnString());
    if (confirmYN === "Yes") {
        const departmentId = await departmentQueries.departmentId(department);                    
        const deleteDepartment = await globalQueries.deleteRecord("departments", "id", departmentId);
        console.log(`\nDepartment ${department} has been deleted.\nVerify update below:`);
        allDepartments();
    }    
    else {
        mainMenu.options();
    }
  }
  catch (error) {
    console.log("Error in index.js removeDepartment(): " + error);
  }
}

// Delete Role
async function removeRole() {
  try {
    Questions.DeleteRole.choices = await globalQueries.selectTableCol("title", "roles");
    const { role } = await inquirer.prompt(Questions.DeleteRole.returnString());
    const { confirmYN } = await inquirer.prompt(Questions.DeleteConfirm.returnString());
    if (confirmYN === "Yes") {
        const roleId = await roleQueries.roleById(role);                    
        const deleteRole = await globalQueries.deleteRecord("roles", "id", roleId);            
        console.log(`\nRole ${role} has been deleted.\nVerify update below:`);
        allRoles();
    }    
    else {
        mainMenu.options();
    }
  }
  catch (error) {
    console.log("Error in index.js removeRole(): " + error);
  }
}

function exit() {
  db.end();
  console.log("\n\nConnection closed. Good bye!\n\n");
}

start();