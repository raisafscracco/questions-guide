const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question.js");
const Answer = require("./database/Answer.js");

//database
connection
 .authenticate()
 .then(() => {
    console.log("The database connection is complete!")
 })
 .catch((errorMsg) => {
    console.log(errorMsg);
 })

//telling to express to use EJS as a view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {
    //Listing the questions
    //findAll method is equal to "SELECT * ALL FROM questions" in MySQL
    Question.findAll({ raw: true, order:[
        ['id','DESC']
    ]}).then(questions => {
        res.render("index", {
            questions: questions
        });
    });
});

app.get("/toask", (req,res) => {
    res.render("toAsk");
});

app.post("/savequestion", (req,res) => {
    //inserting the datas of the form in the title and description variables.
    var title = req.body.title;
    var description = req.body.description;

    //create method is equal to "INSERT INTO..." in sql
    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    })
});

app.get("/question/:id", (req,res) => {
    var id = req.params.id;
    Question.findOne({
        where:{id: id}
    }).then(question => {
        if(question != undefined) {//question found
            Answer.findAll({
                where:{questionId: question.id},
                order:[
                    ['id', "DESC"]
                ] 
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answers: answers
                });
            });
        }else { //question not found
            res.redirect("/")
        }
    });
});

app.post("/answer", (req, res) => {
    var body = req.body.body;
    var questionId = req.body.question;
    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/"+questionId)
    });
});

app.listen(8080, () => {
    console.log("The application is running!")
});