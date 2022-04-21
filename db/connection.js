const mysql = require('mysql2');

//connect to sql database
const db = mysql.createConnection(
  {
      host: 'localhost',
      //your MySQL username,
      user: 'root',
      //Your MySQL password
      password: 'Luckiestmanx5150',
      database: 'workplace'
  }
);

module.exports = db;