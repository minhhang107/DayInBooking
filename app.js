var express = require("express");
var path = require("path");
var app= express();

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));


//set up routes

app.get('/index', function(req, res){
    res.sendFile(path.join(__dirname,"/views/index.html"))
});

app.get('/room-listing', function(req, res){
    res.sendFile(path.join(__dirname,"/views/room-listing.html"))
});



app.listen(HTTP_PORT);