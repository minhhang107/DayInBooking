var express = require("express");
var path = require("path");
var app= express();

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));


//set up routes

app.get('/index', function(req, res){
    res.sendFile(path.join(__dirname,"/views/index.html"))
});

app.get('/search-result', function(req, res){
    res.sendFile(path.join(__dirname,"/views/search-result.html"))
});

app.get('/room-details', function(req, res){
    res.sendFile(path.join(__dirname,"/views/room-details.html"))
});

app.get('/book-now', function(req, res){
    res.sendFile(path.join(__dirname,"/views/book-now.html"))
});

app.get('/upload-room', function(req, res){
    res.sendFile(path.join(__dirname,"/views/upload-room.html"))
});



app.listen(HTTP_PORT);