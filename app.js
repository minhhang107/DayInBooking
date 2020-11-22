var express = require('express');
var app= express();
var path = require("path");
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

//const config = require("./config.js");

mongoose.createConnection("mongodb://localhost/DayIn", { useNewUrlParser: true, useUnifiedTopology: true });

var HTTP_PORT = process.env.PORT || 8080;



function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(clientSessions({
    cookieName: "session",
    secret: "Web322",
    duration: 2*60*1000,
    activeDuration: 1000*60
}))

const STORAGE = multer.diskStorage({
    destination: "./public/photos/",
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const UPLOAD = multer({storage: STORAGE});





//set up routes

app.get('/', function(req, res){
    res.render('index', {layout: false});
});

app.get('/search-result', function(req, res){
    res.render('search-result', {layout: false});
});

app.get('/room-details', function(req, res){
    res.render('room-details', {layout: false});
});

app.get('/book-now', function(req, res){
    res.render('book-now', {layout: false});
});

app.get('/upload-room', function(req, res){
    res.render('upload-room', {layout: false});
});

app.post("/upload-for-process", UPLOAD.single("photo"), adminController.uploadPhoto);

app.get('/confirm', function(req, res){
    res.render('confirm', {layout: false});
});

// app.post("/sign-up", userController.addUser);

app.post('/sign-up', userController.addUser);

app.post("/log-in", userController.logIn);

app.post("/room-details", adminController.addRoom);

app.post("/search-result", userController.searchRooms);

app.get('/log-in', function(req, res){
    res.render('log-in', {layout: false});
});

app.get('/dashboard', function(req, res){
    res.render('dashboard', {layout: false});
});


app.get('/sign-up', function(req, res){
    res.render('sign-up', {layout: false});
});

app.get('/log-out', (req, res)=>{
    req.session.reset();
    res.redirect("/");
})

app.post('/delete-room/:roomID', adminController.deleteRoom);

// test front end for user/admin dashboard
app.get('/user-dashboard', function(req, res){
    res.render('user-dashboard', {layout: false});
});

app.get('/admin-dashboard', function(req, res){
    res.render('admin-dashboard', {layout: false});
});

//app.post('/admin-dashboard', adminController.deleteRoom);

app.listen(HTTP_PORT, onHttpStart());