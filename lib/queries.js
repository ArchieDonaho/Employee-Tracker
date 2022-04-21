const db = require('../db/connection');

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

function updateEmployeeRoleQuery(){

}

function addRoleQuery(){

}

function addDepartmentQuery(){

}

module.exports = {
  addEmployeeQuery,
  updateEmployeeRoleQuery,
  addRoleQuery,
  addDepartmentQuery
};