const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get budget grouped by department, showing count of employees
router.get('/budget', (req, res) => {
  const sql = `
  SELECT department_name AS department, COUNT(*) AS Employees, SUM(salary) AS totalSalaries
  FROM employees AS A
  LEFT JOIN roles 
  ON A.role_id = roles.id
  LEFT JOIN departments
  ON roles.department_id = departments.id
  GROUP BY department_name
  ORDER BY totalSalaries DESC;  
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

module.exports = router;