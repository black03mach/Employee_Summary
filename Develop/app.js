const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
let people = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function inquirerPrompt() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please enter the manager name.",
            name: "name",
        }, 
        {
            type: "input",
            message: "Please enter the employee ID.",
            name: "id",
        },
        {
            type: "input",
            message: "Please enter company email address.",
            name: "email"
        }, 
        {
            type: "input",
            message: "What is the office number?",
            name: "office"
        }
        ]).then((input) => {
            console.log(input)
            people.push(new Manager(input.name, input.id, input.email, input.office));
            internorEngineer(people, input)
        })
}
function internorEngineer() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please enter the employee's name.",
            name: "name",
        },
        {
            type: "input",
            message: "Please enter the employee ID.",
            name: "id",
        },
        {
            type: "input",
            message: "Please enter company email address.",
            name: "email"
        },
        {
            type: "checkbox",
            message: "Please select Role.",
            name: "role",
            choices: ["Intern", "Engineer"]
        }]).then((input2) => {
            switch (input2.role[0]) {
                case "Intern":
                    inquirer
                        .prompt([{
                            type: "input",
                            message: "Please enter the intern's university.",
                            name: "university"
                        }]).then((internInfo) => {
                            console.log('internInfo',internInfo);
                            console.log('input2',input2);
                            people.push(new Intern(input2.name, input2.id, input2.email, internInfo.university))
                            inquirer
                                .prompt([{
                                    type: "confirm",
                                    message: "Do you have another Employee to add?",
                                    name: "yn"
                                }]).then((answer) => {
                                    if (answer.yn === true) {
                                        internorEngineer()
                                    }
                                    else {
                                        fs.writeFile(outputPath, render(people), function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                            console.log("Success")
                                        })
                                    }
                                })
                        })
                    // console.log(input2.role[0])
                    break;
                case "Engineer":
                    inquirer
                        .prompt([{
                            type: "input",
                            message: "Please enter the Github URL",
                            name: "github"
                        }]).then((engInfo) => {
                            console.log('engInfo',engInfo);
                            console.log('input2',input2);
                            people.push(new Engineer(input2.name, input2.id, input2.email, engInfo.github))
                            inquirer
                                .prompt([{
                                    type: "input",
                                    message: "Do you have another Employee to add?",
                                    name: "yn"
                                }]).then((answer) => {
                                    if (answer.yn == "yes") {
                                        internorEngineer()
                                    }
                                    else {
                                        fs.writeFile(outputPath, render(people), function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                            console.log("Success")
                                        })
                                    }
                                })
                        })
                    // console.log(input2.role[0])
                    break
                default:
                    console.log("Invalid Input");
            }
        })
}
inquirerPrompt();