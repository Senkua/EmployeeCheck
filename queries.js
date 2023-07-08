// queries.js

const inquirer = require('inquirer');

async function viewAllDepartments(connection) {
  const [rows] = await connection.query('SELECT id, name FROM department');
  console.table(rows);
}

async function viewAllRoles(connection) {
  const [rows] = await connection.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `);
  console.table(rows);
}

async function viewAllEmployees(connection) {
  const [rows] = await connection.query(`
    SELECT
      employee.id,
      employee.first_name,
      employee.last_name,
      role.title,
      department.name AS department,
      role.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `);
  console.table(rows);
}

async function addDepartment(connection) {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:'
    }
  ]);

  await connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
  console.log('Department added successfully!');
}

async function addRole(connection) {
  const [departments] = await connection.query('SELECT id, name FROM department');

  const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'roleTitle',
      message: 'Enter the title of the role:'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Enter the salary for the role:'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);

  await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitle, roleSalary, departmentId]);
  console.log('Role added successfully!');
}

async function addEmployee(connection) {
  const [roles] = await connection.query('SELECT id, title FROM role');
  const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the employee\'s first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee\'s last name:'
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role for the employee:',
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id
      }))
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the manager for the employee (optional):',
      choices: [
        { name: 'None', value: null },
        ...employees.map((employee) => ({
          name: employee.name,
          value: employee.id
        }))
      ]
    }
  ]);

  await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
  console.log('Employee added successfully!');
}

async function updateEmployeeRole(connection) {
  const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
  const [roles] = await connection.query('SELECT id, title FROM role');

  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employees.map((employee) => ({
        name: employee.name,
        value: employee.id
      }))
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role for the employee:',
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);

  await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  console.log('Employee role updated successfully!');
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};
