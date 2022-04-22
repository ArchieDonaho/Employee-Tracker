const db = require('../db/connection');

//adds a new employee
function addEmployeeQuery(firstName, lastName, role, manager){

  //grab the id's of the role and employee      
  role = role.split('.', 1)[0]
  if(manager == 'None'){
      manager = null;
  } else {
      manager = manager.split('.', 1)[0]
  }

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
  const params = [firstName, lastName, role, manager];

  db.query(sql, params, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }
  });
}
//updates an employee's role
function updateEmployeeRoleQuery(employee, role){
  //grab the id's of the role and employee      
  role = role.split('.', 1)[0]
  employee = employee.split('.', 1)[0]

  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const params = [role, employee];

  db.query(sql, params, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }
  });

}
//adds a new role
function addRoleQuery(name, salary, department){
  department = department.split('.', 1)[0];
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
  const params = [name, salary, department];

  db.query(sql, params, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }
  });

}
//adds a new department
function addDepartmentQuery(name){
  const sql = `INSERT INTO department (name) VALUES (?)`;
  const params = [name];

  db.query(sql, params, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }
  });

}

module.exports = {
  addEmployeeQuery,
  updateEmployeeRoleQuery,
  addRoleQuery,
  addDepartmentQuery
};