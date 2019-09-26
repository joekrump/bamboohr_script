#!/usr/bin/env node

const { exec } = require('child_process');
const { BAMBOO_HR_API_KEY, BAMBOO_HR_ORG } = process.env;

function getEmployessByJobTitle(jobTitle, employees) {
  return employees.reduce((employeesWithRole, employee) => {
    if (employee.jobTitle.toLowerCase() === jobTitle.toLowerCase()) {
      employeesWithRole.push(employee.displayName);
    }

    return employeesWithRole;
  }, [])
  .sort();
}

function processResult(result, jobTitle) {
  const data = JSON.parse(result);

  const employeesWithJobTitle = getEmployessByJobTitle(jobTitle, data.employees);

  console.log("Names:");
  console.log(employeesWithJobTitle);
  console.log("Count: ", employeesWithJobTitle.length)
}

function getBambooHRData(callback, jobTitle) {
  exec(`curl --header "Accept: application/json" -u "${BAMBOO_HR_API_KEY}:x" "https://api.bamboohr.com/api/gateway.php/${BAMBOO_HR_ORG}/v1/employees/directory"`, {
    encoding: 'utf8',
  }, (_err, stdout, _stderr) => callback(stdout, jobTitle));
}

switch(process.argv[2]) {
  case "whoare":
    console.log("Who has the job title '" + process.argv[3] + "'?\n");
    getBambooHRData(processResult, process.argv[3]);
    break;
  default:
    console.log("Invalid Command\n");
    console.log(`
Usage:

./bamboo.js <command> <args>

Commands:

whoare <job_title_string> - get a list of names of people who have a specific job title
    `);
    break;
}
