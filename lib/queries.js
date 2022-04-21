const inquirer = require('inquirer');
const db = require('../db/connection');

//initialize the roles
var roles;
db.query(`SELECT title FROM role`, (err, row) => {
  roles = row.map(name => {
    return `'${name.title}',`;
  })
});


const getEmployeesQuery = () => {
  const sql = `SELECT * FROM employee`
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows)
    });
}

function addEmployeeQuery(){
  // console.log(roles);
  //generate the questions
  inquirer.prompt(
    [
      {
        type: 'text',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: input => {
            if(input){
                return true;
            } else {
                console.log("(This section cannot be blank)")
                return false;
            }
        }
      },
      {
        type: 'text',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: input => {
            if(input){
                return true;
            } else {
                console.log("(This section cannot be blank)")
                return false;
            }
        }
      },
      {
        type: 'lsit',
        name: 'role',
        message: "What is the employee's role?",
        choices: roles
      },
      // {},
      // {}
    ]
  )
  .then( ({firstName, lastName, role}) => {
    console.log(firstName, lastName, role)
  })

}

module.exports = addEmployeeQuery;