INSERT INTO department (name)
VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Lead Engineer', 150000, 1),
  ('Software Engineer', 125000, 1),
  ('Account Manager', 160000, 2),
  ('Accountant', 125000, 2),
  ('Legal Team Lead', 250000, 3),
  ('Lawyer', 190000, 3),
  ('Sales Lead', 100000, 4),
  ('Salesperson', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Ronald', 'Firbank', 1, null),
        ('Virginia', 'Woolf', 2, 1),
        ('Piers', 'Gaveston', 3, null),
        ('Charles', 'LeRoi', 4, 3),
        ('Katherine', 'Mansfield', 5, null),
        ('Dora', 'Carrington', 6, 5),
        ('Edward', 'Bellamy', 7, null),
        ('Montague', 'Summers', 8, 7);

-- -- returns all emplyees with their id
-- SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS name
--   FROM employee

-- -- returns all emplyees with all data
-- SELECT e.id AS id,
--        CONCAT(e.first_name, ' ' , e.last_name) AS name,
--        role.title AS role,
--        department.name AS department,
--        role.salary AS salary,
--        m.first_name AS Manager
-- FROM employee e
--   LEFT JOIN role ON e.role_id = role.id
--   LEFT JOIN employee m ON m.ID = e.manager_id
--   LEFT JOIN department ON role.department_id = department.id
 

-- -- returns all managers currently managing an emplyee with their id
-- SELECT m.id, m.first_name
-- FROM employee e
--   JOIN employee m ON m.id = e.manager_id
--   GROUP BY(m.id)

-- -- returns all emplyees with a manager role
-- SELECT employee.id AS id, CONCAT(employee.first_name, ' ' , employee.last_name) AS name
-- FROM employee
-- WHERE role_id = 3

-- -- returns all roles
-- SELECT role.title AS name, 
--        role.salary AS salary, 
--        department.name AS department
-- FROM role
--   LEFT JOIN department ON role.department_id = department.id