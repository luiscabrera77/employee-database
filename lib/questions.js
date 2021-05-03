// Class for all questions
class PromptQuestion {
  constructor (message, name) {
      this.message = message;
      this.name = name;
  }

  returnString() {
      return JSON.parse(`{"message" : "${this.message}",
      "name" : "${this.name}"}`);
  }
}

// Class for 'list' type questions
class ChoiceQuestion extends PromptQuestion {
  constructor (message, name, choices) {
      super(message, name);
      this.type = "list";
      this.choices = choices;
  }

  stringifyChoices() {
      return this.choices.join('","') + '"';
  }

  returnString() {
      return JSON.parse(`{"type" : "list",
      "message" : "${this.message}",
      "name" : "${this.name}",
      "choices" : ["${this.stringifyChoices()}]}`);
  }
}

// Generate questions
const Questions = {};

Questions.Departments = new ChoiceQuestion("Select a department", "department_name", []);
Questions.Managers = new ChoiceQuestion("Select a manager", "manager_name", []);
Questions.EmployeeNewRole1 = new ChoiceQuestion("Select an employee to update his/her role", "employee", []);
Questions.EmployeeNewRole2 = new ChoiceQuestion("Select a new role", "role", []);
Questions.EmployeeNewManager1 = new ChoiceQuestion("Select an employee to update his/her manager", "employee", []);
Questions.EmployeeNewManager2 = new ChoiceQuestion("Select a new manager", "manager", []); // careful! this "manager" name needs to match what you expect in the const.
Questions.RoleNewDepartment = new ChoiceQuestion("Select a role", "role", []);
Questions.NewDepartment = new PromptQuestion("Enter the new department name", "department_name");
Questions.NewEmployeeFirst = new PromptQuestion("Employee's first name", "first_name");
Questions.NewEmployeeLast = new PromptQuestion("Employee's last name", "last_name");
Questions.NewEmployeeRole = new ChoiceQuestion("Select a role", "role", []);
Questions.NewEmployeeManager = new ChoiceQuestion("Select a new manager", "manager", []);
Questions.NewRoleDepartment = new ChoiceQuestion("Select a department for the new role", "department", []);
Questions.NewRoleTitle = new PromptQuestion("New role title", "title");
Questions.NewRoleSalary = new PromptQuestion("New role salary", "salary");
Questions.DeleteEmployee = new ChoiceQuestion("Select the employee you want to remove", "employee", []);
Questions.DeleteDepartment = new ChoiceQuestion("Select the department you want to remove", "department", []);
Questions.DeleteRole = new ChoiceQuestion("Select the role you want to remove", "role", []);
Questions.DeleteConfirm = new ChoiceQuestion("Are you Sure? This action cannot be undone", "confirmYN", ["Yes", "No"]);

// Export classes
module.exports = {Questions : Questions};