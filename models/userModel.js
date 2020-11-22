var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var room = require("./roomModel");
mongoose.Promise = require("bluebird");

let db = mongoose.createConnection("mongodb://localhost/DayIn", { useNewUrlParser: true, useUnifiedTopology: true });

var UserSchema = new Schema({
    "username": {
        "type": String,
        "unique": true
    },
    "fname": String,
    "lname": String,
    "email":{
        "type": String,
        "unique": true
    },
    "password": String,
    "isAdmin": {
        "type": Boolean,
        "default": false
    },
    "bookings": {
        "startDate": {
            "type": Date,
            "default": null
        },
        "endDate": {
            "type": Date,
            "default": null
        },
        //"room": [room]
    }
});


module.exports = db.model("Users", UserSchema);