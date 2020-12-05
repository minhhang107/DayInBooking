var express = require('express');
var app= express();
require("dotenv").config();
var bodyParser = require('body-parser')
var multer = require("multer");
const hbs = require('express-handlebars');
const clientSessions = require("client-sessions");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userController = require('./controllers/userController');
var adminController = require('./controllers/adminController');
var userModel = require("./models/userModel");
var roomModel = require("./models/roomModel")

const userRoutes = require("./controllers/userController");
const generalRoutes = require("./controllers/generalController");
const adminRoutes = require("./controllers/adminController");

mongoose.createConnection("mongodb://localhost/DayIn", { useNewUrlParser: true, useUnifiedTopology: true });

var HTTP_PORT = process.env.PORT || 8080;



function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(clientSessions({
    cookieName: "session",
    secret: "Web322",
    duration: 30*60*1000,
    activeDuration: 1000*60
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",generalRoutes);
app.use("/",userRoutes);
app.use("/",adminRoutes);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');





app.listen(HTTP_PORT, onHttpStart());