const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('../db/connection');
const { addEmployeeQuery,
    updateEmployeeRoleQuery,
    addRoleQuery,
    addDepartmentQuery,
    updateEmployeesManagerQuery } = require('./queries')

// set/reset roles list
var roles;
const resetRoles = () => {
    db.query(`SELECT title FROM role`, (err, row) => {
        roles = row.map((name, index) => {
            return `${index + 1}. ${name.title}`;
        })
    });
};

// set/reset employees list
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

//set/reset department list
var departments;
const resetDepartments = () => {
    const sql = `SELECT department.name FROM department`
    db.query(sql, (err, row) => {
        departments = row.map((name, index) => {
            return `${index + 1}. ${name.name}`;
        });
    });
}
//run the functions to initialize the lists
resetEmployees();
resetRoles();
resetDepartments();


// gets a list of employees that does not include the currently selected employee
var potentialManagers;
const setPotentialManagers = (employee) => {
    //grab the id of the current employee
    employee = employee.split('.', 1)[0];
    //using the current list of employees, create a new array
    potentialManagers = employees.map((name, index) => {
        return `${name}`;
    });
    //then, remove the index of the employee that was passed through, and add a 'none' option
    potentialManagers.splice(employee - 1, 1);
    potentialManagers.push('None');
}


//create the workplace function
function Workplace(){
}
//starts the questions
Workplace.prototype.start = function(){
    console.log(`
    Welcome to the Employee Tracker
    _______________________________
    `);
    this.questions();
}
//contains the questions asked after each function
Workplace.prototype.questions = function(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'List All Employees',
                    'List All Roles',
                    'List All Departments',
                    'List All Managers Currently Managing Employees',
                    'Add A New Employee',
                    'Add A New Role',
                    'Add A New Department',
                    "Update An Employee's Role",
                    "Update An Employee's Manager",
                    'Quit'
                ]
            }
        ]
    )
    .then( ({ options }) => {
        switch(options){
            case 'List All Employees':
                this.viewAllEmployees();
                break;
            case 'Add A New Employee':
                this.addEmployee();
                break;
            case "Update An Employee's Role":
                this.updateEmployeeRole();
                break;
            case "Update An Employee's Manager":
                this.updateEmployeesManager();
                break;
            case 'List All Managers Currently Managing Employees':
                this.viewAllManagersCurrentlyManaging();
                break;
            case 'List All Roles':
                this.viewAllRoles();
                break;
            case 'Add A New Role':
                this.addRole();
                break;
            case 'List All Departments':
                this.viewAllDepartments();
                break;
            case 'Add A New Department':
                this.addDepartment();
                break;
            case 'Quit':
                this.quit();
                break;
        }
    })
}
//displays all employees and other corresponding data
Workplace.prototype.viewAllEmployees = function(){
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
        //start the next set of questions
        this.questions();
    });
}
//adds a new employee
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
        //send the data to get added to the table
        addEmployeeQuery(firstName, lastName, role, manager)
        //reset the employees list, since it has been updated
        resetEmployees();
        console.log('\nEmployee Added\n');
        //start the next set of questions
        this.questions()
    })
}
//updates the role of an employee
Workplace.prototype.updateEmployeeRole = function(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to change the role on?',
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
        //send the data to update
        updateEmployeeRoleQuery(employee, role)
        //reset the employees since we updated the roles
        resetEmployees();
        console.log('\nRole Updated\n')
        //start the next set of questions
        this.questions();
    })
}
//displays all managers
Workplace.prototype.viewAllManagersCurrentlyManaging = function(){
    const sql = `SELECT m.id, m.first_name
                 FROM employee e
                 JOIN employee m ON m.id = e.manager_id
                 GROUP BY(m.id)
                `;
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows);
        this.questions();
    })
}
//updates a selected employee's manager
Workplace.prototype.updateEmployeesManager = function(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to change the manager on?',
                choices: employees
            }
        ]
    )
    .then( ({ employee }) => {
        //generate a list of employees that does not include the currently selected employee
        setPotentialManagers(employee);
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Which employee do you want to set to be the manager?',
                    choices: potentialManagers
                }
            ]
        )
        .then( ({ manager }) => {  
            //send the data to update
            updateEmployeesManagerQuery(employee, manager);
            // reset the employees list since we updated the managers
            resetEmployees();
            console.log('\nRole Updated\n')
            //start the next set of questions
            this.questions();
        })
    })
}
//displays all roles
Workplace.prototype.viewAllRoles = function(){
    const sql = `SELECT role.id AS id,
                        role.title AS name, 
                        role.salary AS salary, 
                        department.name AS department
                 FROM role
                    LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows);
        //start the next set of questions
        this.questions();
    })
}
//adds a new role
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
        //send the data to add to the table
        addRoleQuery(name, salary, department);
        //reset the roles, since they have been updated
        resetRoles();
        console.log('\nAdded Role\n')
        //start the next set of questions
        this.questions();
    })
}
//displays all departments
Workplace.prototype.viewAllDepartments = function(){
    const sql = `SELECT department.id AS id,
                        department.name AS department_name 
                 FROM department`;
    db.query(sql, (err, rows) => {
        console.log('\n')
        console.table(rows);
        this.questions();
    })
}
//adds a new department
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
        //send the data to add to the table
        addDepartmentQuery(name);
        //reset the departments list since a new one has been added
        resetDepartments();
        console.log('\nAdded Department\n')
        //start the next set of questions
        this.questions();
    })
}
//exits the cli
Workplace.prototype.quit = function(){
    console.log('\nBye!');
    process.exit();
}

module.exports = Workplace;