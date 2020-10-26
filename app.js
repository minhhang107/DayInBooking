var express = require('express');
var app= express();
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
const hbs = require('express-handlebars');

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


var transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:'mh.web322@gmail.com',
        pass: 'web/322/'
    }
});

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

app.get('/confirm', function(req, res){
    res.render('confirm', {layout: false});
});

app.post("/dashboard",  (req,res)=>{
    const FORM_DATA = req.body;
    
    res.render('dashboard', {
        firstName: FORM_DATA.fname,
        layout: false
    });

    var emailOptions = {
        from: 'mh.web322@gmail.com',
        to: FORM_DATA.email,
        subject: 'Welcome to DayIn!',
        html: '<p>Hello ' + FORM_DATA.fname + ",</p><p>Welcome to DayIn!<p/><p>You're now a part of our community that connects global travellers with local hosts throughout Canada. Now you can find a place to stay or share your amazing home with visitors.</p><p>Please click <a href='#'>here</a> to verify your account.</p>"
    }

    transporter.sendMail(emailOptions, (error, info)=>{
        if (error){
            console.log("ERROR: " + error);
        }
        else{
            console.log("SUCCESS: " + info.response);
        }
    })
})


app.listen(HTTP_PORT, onHttpStart());