const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all employees with title, department, salary and manager 
router.get('/employees', (req, res) => {
  const sql = `
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

// Get employees by department
router.get('/employeesbydepartment/:id', (req, res) => {
  const sql = `
  SELECT A.id, A.first_name, A.last_name, title, salary,
  CONCAT(B.first_name, ' ', B.last_name) AS manager
  FROM employees AS A
  LEFT JOIN employees AS B 
  ON A.manager_id = B.id  
  LEFT JOIN roles 
  ON A.role_id = roles.id  
  LEFT JOIN departments 
  ON roles.department_id = departments.id
  WHERE roles.department_id = ? 
  ORDER BY A.id;
  `;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    else if (row=="") {
      res.json({data: 'department has no employees'});
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Get employees by manager
router.get('/employeesbymanager/:id', (req, res) => {
  const sql = `
  SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary
  FROM employees AS A 
  LEFT JOIN roles 
  ON A.role_id = roles.id  
  LEFT JOIN departments 
  ON roles.department_id = departments.id
  WHERE manager_id = ? 
  ORDER BY A.id;
  `;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    else if (row=="") {
      res.json({data: 'employee has no direct reports'});
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Add a new Employee
router.post('/newemployee', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'role_id',
    'manager_id'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.role_id,
    body.manager_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
      changes: result.affectedRows
    });
  });
});

// Update Employee Role
router.put('/updaterole/:id', (req, res) => {
  const errors = inputCheck(req.body, 'role_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  // role_id must be sent in the JSON body, while id is in the URL
  const sql = `
  UPDATE employees 
  SET role_id = ? 
  WHERE id = ?;
  `;
  const params = [req.body.role_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Update Employee Manager
router.put('/updatemanager/:id', (req, res) => {
  const errors = inputCheck(req.body, 'manager_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  // manager_id must be sent in the JSON body, while id is in the URL
  const sql = `
  UPDATE employees 
  SET manager_id = ? 
  WHERE id = ?;
  `;
  const params = [req.body.manager_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete Employee
router.delete('/deleteemployee/:id', (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;