USE employee_tracker;

SELECT * from employees;
SELECT * from roles;
SELECT * from departments;

SELECT * FROM departments ORDER BY id;  
     
SELECT A.id, title, salary, B.department_name AS department
FROM roles AS A
LEFT JOIN departments AS B
ON A.department_id = B.id 
ORDER BY A.id;     

SELECT department_name AS department, COUNT(*) AS Employees, SUM(salary) AS totalSalaries
FROM employees AS A
LEFT JOIN roles 
ON A.role_id = roles.id
LEFT JOIN departments
ON roles.department_id = departments.id
GROUP BY department_name
ORDER BY totalSalaries DESC; 
     
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

SELECT C.id, department_name AS department, COUNT(*) AS Employees
FROM employees AS A 
INNER JOIN roles AS B
ON A.role_id = B.id  
RIGHT JOIN departments AS C
ON B.department_id = C.id
GROUP BY C.id;

SELECT A.id, department_name
FROM departments AS A
LEFT JOIN roles AS B
ON A.id = B.department_id
LEFT JOIN employees AS C
ON B.id = C.role_id
ORDER BY A.id;

SELECT C.id AS id, department_name AS name, COUNT(A.first_name) AS headcount
FROM employees AS A 
LEFT JOIN roles
ON A.role_id = roles.id 
RIGHT JOIN departments AS C
ON roles.department_id = C.id
GROUP by C.id;



SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary
FROM employees AS A 
LEFT JOIN roles 
ON A.role_id = roles.id  
LEFT JOIN departments 
ON roles.department_id = departments.id
WHERE manager_id = 5 
ORDER BY A.id;

SELECT A.id, A.first_name, A.last_name, title, salary,
CONCAT(B.first_name, ' ', B.last_name) AS manager
FROM employees AS A
LEFT JOIN employees AS B 
ON A.manager_id = B.id  
LEFT JOIN roles 
ON A.role_id = roles.id  
LEFT JOIN departments 
ON roles.department_id = departments.id
WHERE roles.department_id = 3 
ORDER BY A.id;

SELECT A.id, A.first_name, A.last_name, title, salary,
CONCAT(B.first_name, ' ', B.last_name) AS manager
FROM employees AS A
LEFT JOIN employees AS B 
ON A.manager_id = B.id  
LEFT JOIN roles 
ON A.role_id = roles.id  
LEFT JOIN departments 
ON roles.department_id = departments.id
WHERE departments.department_name = 'Management' 
ORDER BY A.id;

UPDATE employees 
SET role_id = 2 
WHERE id = 1;

UPDATE employees 
SET manager_id = 3 
WHERE id = 1;


SELECT A.id, A.first_name, A.last_name, title, department_name AS department, salary
FROM employees AS A
LEFT JOIN employees AS B 
ON A.manager_id = B.id 
LEFT JOIN roles 
ON A.role_id = roles.id 
LEFT JOIN departments 
ON roles.department_id = departments.id 
WHERE CONCAT(B.first_name, ' ', B.last_name) = 'Carlos Lorain';

SELECT id FROM employees 
WHERE CONCAT(first_name,' ',last_name) = 'Karla Smith';


SELECT C.id, COUNT department_name 
FROM employees AS A
LEFT JOIN roles 
ON A.role_id = roles.id
LEFT JOIN departments AS C
ON roles.department_id = C.id
GROUP BY name;

SELECT B.*, COUNT(*) AS headcount
FROM employees AS A
LEFT JOIN roles 
ON A.role_id = roles.id
LEFT JOIN departments AS B;