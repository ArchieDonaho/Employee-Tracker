INSERT INTO department (name)
VALUES
  ('Department 1'),
  ('Department 2'),
  ('Department 3');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Engineer', 80000, 1),
  ('Intern', 40000, 1),
  ('Manager', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Ronald', 'Firbank', 3, null),
        ('Virginia', 'Woolf', 1, null),
        ('Piers', 'Gaveston', 1, null),
        ('Charles', 'LeRoi', 2, 1),
        ('Katherine', 'Mansfield', 2, 2),
        ('Dora', 'Carrington', 1, null),
        ('Edward', 'Bellamy', 2, 3),
        ('Montague', 'Summers', 2, 2),
        ('Octavia', 'Butler', 1, 1),
        ('Unica', 'Zurn', 2, 3);


-- returns all emplyees with their id
SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS name
  FROM employee

-- returns all emplyees with their role and manager names
SELECT CONCAT(e.first_name, ' ' , e.last_name) AS name,
       role.title AS role,
       m.first_name AS Manager
FROM employee e
 LEFT JOIN employee m ON m.ID = e.manager_id
 LEFT JOIN role ON e.role_id = role.id;

-- returns all managers with their id
SELECT m.id, m.first_name
FROM employee e
  JOIN employee m ON m.id = e.manager_id
  GROUP BY(m.id)

-- returns all roles
SELECT role.title AS name, 
       role.salary AS salary, 
       department.name AS department
FROM role
  LEFT JOIN department ON role.department_id = department.id