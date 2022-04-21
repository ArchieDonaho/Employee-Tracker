const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('../db/connection');
// const { addEmployeeQuery,
//     updateEmployeeRoleQuery,
//     addRoleQuery,
//     addDepartmentQuery } = require('./queries')

// set/reset the roles for use
var roles;
const resetRoles = () => {
    db.query(`SELECT title FROM role`, (err, row) => {
        roles = row.map((name, index) => {
            return `${index + 1}. ${name.title}`;
        })
    });
};

// set/reset the managers for use
var managers;
const resetManagers = () => {
    const sql = `SELECT m.id, m.first_name
                 FROM employee e
                 JOIN employee m ON m.id = e.manager_id
                 GROUP BY(m.id)`;
    db.query(sql, (err, row) => {
        managers = row.map((name, index) => {
            return `${index + 1}. ${name.first_name}`;
        });
        managers.push('None');
    });
}

// set/reset all employees for use
var employees;
const resetEmployees = () => {
    const sql = `SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS name
                 FROM employee`;
    db.query(sql, (err, row) => {
        employees = row.map((name, index) => {
            return `${index + 1}. ${name.name}`;
        });
    });
}

var departments;
const resetDepartments = () => {
    const sql = `SELECT department.name FROM department`
    db.query(sql, (err, row) => {
        departments = row.map((name, index) => {
            return `${index + 1}. ${name.name}`;
        });
    });
}

resetEmployees();
resetManagers();
resetRoles();
resetDepartments();

function Workplace(){
}

Workplace.prototype.start = function(){
    console.log(`
    Welcome to the Employee Tracker
    _______________________________
    `);
    this.questions();
}

Workplace.prototype.questions = function(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View all roles',
                    'Add Role',
                    'View all departments',
                    'Add department',
                    'Quit'
                ]
            }
        ]
    )
    .then( ({ options }) => {
        switch(options){
            case 'View all employees':
                this.viewAllEmployees();
                break;
            case 'Add Employee':
                this.addEmployee();
                break;
            case 'Update Employee Role':
                this.updateEmployeeRole();
                break;
            case 'View all roles':
                this.viewAllRoles();
                break;
            case 'Add Role':
                this.addRole();
                break;
            case 'View all departments':
                this.viewAllDepartments();
                break;
            case 'Add department':
                this.addDepartment();
                break;
            case 'Quit':
                this.quit();
                break;
        }
    })
}

Workplace.prototype.viewAllEmployees = function(){
    // getEmployeesQuery();
    const sql = `SELECT e.id AS id,
                        CONCAT(e.first_name, ' ' , e.last_name) AS name,
                        role.title AS role,
                        department.name AS department,
                        role.salary AS salary,
                        m.first_name AS Manager
                 FROM employee e
                    LEFT JOIN role ON e.role_id = role.id
                    LEFT JOIN employee m ON m.ID = e.manager_id
                    LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        console.log('\n');
        console.table(rows);
        this.questions();
    });
}

Workplace.prototype.addEmployee = function(){
    employees.push('None');
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
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles
          },
          {
            type: 'list',
            name: 'manager',
            message: "What is the employee's Manager? (If they have one)",
            choices: employees
          }
        ]
    )
    .then( ({firstName, lastName, role, manager}) => {
        // addEmployeeQuery(firstName, lastName, role, manager)
        // grab the id's of the role and employee      
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

        //reset the employees and managers list
        resetEmployees();
        resetManagers();

        console.log('\nEmployee Added\n');
        //start the next set of questions
        this.questions()
    })
}

Workplace.prototype.updateEmployeeRole = function(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'employee',
                message: 'Which emplyee would you like to change the role on?',
                choices: employees
            },
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to change to?',
                choices: roles
            }
        ]
    )
    .then( ({ employee, role }) => {  
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

        //reset the emplyees and managers since we updated the roles
        resetEmployees();
        resetManagers();
        console.log('\nRole Updated\n')
        //start the next set of questions
        this.questions();
    })
}

Workplace.prototype.viewAllRoles = function(){
    const sql = `SELECT role.id AS id,
                        role.title AS role,  
                        department.name AS department,
                        role.salary AS salary
                 FROM role
                    LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows);
        this.questions();
    })
}

Workplace.prototype.addRole = function(){
    inquirer.prompt(
        [
          {
            type: 'text',
            name: 'name',
            message: "What is the name of the role?",
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
            type: 'number',
            name: 'salary',
            message: "What is the role's salary?",
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
            type: 'list',
            name: 'department',
            message: "Which department is the role in?",
            choices: departments
          }
        ]
    )
    .then(({name, salary, department}) => {
        department = department.split('.', 1)[0];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        const params = [name, salary, department];

        db.query(sql, params, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
        });

        resetRoles();
        console.log('\nAdded Role\n')
        this.questions();
    })
}

Workplace.prototype.viewAllDepartments = function(){
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows);
        this.questions();
    })
}

Workplace.prototype.addDepartment = function(){
    inquirer.prompt(
        [
          {
            type: 'text',
            name: 'name',
            message: "What is the name of the department?",
            validate: input => {
                if(input){
                    return true;
                } else {
                    console.log("(This section cannot be blank)")
                    return false;
                }
            }
          }
        ]
    )
    .then(({name}) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [name];

        db.query(sql, params, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
        });

        resetDepartments();
        console.log('\nAdded Department\n')
        this.questions();
    })
}

Workplace.prototype.quit = function(){
    console.log('\nBye!');
    process.exit();
}

module.exports = Workplace;