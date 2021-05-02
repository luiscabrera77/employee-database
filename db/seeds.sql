INSERT INTO departments (department_name)
VALUES
  ('UX'),
  ('Development'),
  ('Management');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Senior UX', 85000, 1),
  ('Junior UX', 65000, 1),
  ('QA', 75000, 2),
  ('Front End Engineer', 85000, 2),
  ('Back End Engineer', 95000, 2),
  ('Architect', 115000, 2),
  ('Studio Manager', 125000, 3),
  ('Product Manager', 125000, 3),
  ('CEO', 150000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
  ('Karla', 'Smith', 1),
  ('Gaby', 'Wolf', 2),
  ('Carlos', 'Lorain', 8),
  ('Jerry', 'Jason', 6),
  ('Edward', 'Hairloom', 7),
  ('Saul', 'Paxton', 5),
  ('Joel', 'Michaels', 4),
  ('Diana', 'Summers', 3),
  ('Cesar', 'Steward', 8),
  ('Sal', 'McDonalds', 9);

UPDATE employees SET manager_id = 5 WHERE id = 1 OR id = 2 OR id = 9;
UPDATE employees SET manager_id = 10 WHERE id = 3 OR id = 4 OR id = 5;
UPDATE employees SET manager_id = 3 WHERE id = 6 OR id = 7 OR id = 8;
