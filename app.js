const express = require('express');
const app= express();
const mongoose = require("mongoose");
require("dotenv").config({path:'./config/keys.env'});
const bodyParser = require('body-parser')
const hbs = require('express-handlebars');
const clientSessions = require("client-sessions");


const userRoutes = require("./controllers/userController");
const generalRoutes = require("./controllers/generalController");
const adminRoutes = require("./controllers/adminController");

mongoose.createConnection("mongodb+srv://mhnguyen16:Web3222020@cluster0.oobyl.mongodb.net/DayIn?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// db.on("error", (err) => {
//     console.log(`db connection error! - ${err}`);
//    });
//    db.once("open", () => {
//     console.log("db connection was successful!");});

var HTTP_PORT = process.env.PORT || 3030;



function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(clientSessions({
    cookieName: "session",
    secret: "Web322",
    duration: 30*60*1000,
    activeDuration: 5*60*1000
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

