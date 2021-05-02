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

Questions.questionDepartments = new ChoiceQuestion("Select a department", "department_name", []);
Questions.question3 = new ChoiceQuestion("Select a manager", "manager_", []);

Questions.question4d = Questions.question3;

Questions.question4a = new PromptQuestion("Enter the new employee's first name", "firstName");
Questions.question4b = new PromptQuestion("Enter employee's last name", "lastName");
Questions.question4c = new ChoiceQuestion("Select a role", "role", []);
Questions.question5a = new ChoiceQuestion("Select an employee to remove", "employee", []);
Questions.question5b = new ChoiceQuestion("When you remove an employee from this database, you cannot retrieve it. Do you still wish to remove this employee?", "confirmYN", ["Yes", "No"]);
Questions.question6a = new ChoiceQuestion("Select an employee whose role should change", "employee", []);
Questions.question6b = new ChoiceQuestion("Select a new role for this employee", "role", []);
Questions.question7a = new ChoiceQuestion("Select an employee whose manager should change", "employee", []);
Questions.question8a = new PromptQuestion("Enter the new role title", "title");
Questions.question8b = new PromptQuestion("Enter the new role salary (£s)", "salary");
Questions.question8c = new ChoiceQuestion("Select the department for the new role", "department", []);
Questions.question9a = new ChoiceQuestion("Select a role to remove", "role", []);
Questions.question9b = new ChoiceQuestion("When you remove a role from this database, you cannot retrieve it. Do you still wish to remove this role?", "confirmYN", ["Yes", "No"]);
Questions.question10 = new PromptQuestion("Enter the new department name", "name");
Questions.question11a = new ChoiceQuestion("Select a department to remove", "department", []);
Questions.question11b = new ChoiceQuestion("When you remove a department from this database, you cannot retrieve it. Do you still wish to remove this department?", "confirmYN", ["Yes", "No"]);
Questions.question12 = new ChoiceQuestion("Select a department to view the total salary for", "department", []);

// Export classes
module.exports = {Questions : Questions};