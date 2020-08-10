const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function inquirerPrompt() {
    inquirer
        .prompt([{
            type: "input",
            message: "Please enter the manager name.",
            name: "name",
        }, {
            type: "input",
            message: "Please enter the employee ID.",
            name: "id",
        },
        {
            type: "input",
            message: "Please enter company email address.",
            name: "email"
        }, {
            type: "input",
            message: "What is the office number?",
            name: "office"
        }
        ]).then((input) => {
            console.log(input)
            let people = [];
            people.push(new Manager(input.name, input.id, input.email, input.office));
            internorEngineer(people, input)
        })
}

function internorEngineer(peopleArray) {
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
                            people.push(new Intern(input2.name, input2.id, input2.email, internInfo.university))
                            inquirer
                                .prompt([{
                                    type: "input",
                                    message: "Do you have another Employee to add?",
                                    name: "yn"
                                }]).then((answer) => {
                                    if (answer == "yes") {
                                        internorEngineer(people)
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
                case "Engineer":
                    inquirer
                        .prompt([{
                            type: "input",
                            message: "Please enter the Github URL",
                            name: "github"
                        }]).then((engInfo) => {
                            people.push(new Engineer(input.name, input.id, input.email, engInfo.github))
                            inquirer
                                .prompt([{
                                    type: "input",
                                    message: "Do you have another Employee to add?",
                                    name: "yn"
                                }]).then((answer) => {
                                    if (answer == "yes") {
                                        internorEngineer(people)
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
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

inquirerPrompt();