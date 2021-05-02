const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: '2T#@q2Y9',
  database: 'employee_tracker'
});

module.exports = db;