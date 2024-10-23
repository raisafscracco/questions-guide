const Sequelize = require("sequelize");
const connection = require("./database");

// model for table Questions
// a model is a representation of a table using a javascript object
const Question = connection.define('question', {
    title:{
        type: Sequelize.STRING,
        allowNULL: false
    },
    description:{
        type: Sequelize.TEXT,
        allowNULL: false
    }
});

Question.sync({force: false}).then(() => {});

module.exports = Question;