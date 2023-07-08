// main.js

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./queries');

async function startApp() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'your_password',
    database: 'your_database'
  });

  console.log('Welcome to the Employee Management System!');

  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ]);

    switch (choice) {
      case 'View all departments':
        await viewAllDepartments(connection);
        break;
      case 'View all roles':
        await viewAllRoles(connection);
        break;
      case 'View all employees':
        await viewAllEmployees(connection);
        break;
      case 'Add a department':
        await addDepartment(connection);
        break;
      case 'Add a role':
        await addRole(connection);
        break;
      case 'Add an employee':
        await addEmployee(connection);
        break;
      case 'Update an employee role':
        await updateEmployeeRole(connection);
        break;
      case 'Exit':
        console.log('Thank you for using the Employee Management System!');
        connection.end();
        return;
      default:
        break;
    }
  }
}

startApp();
