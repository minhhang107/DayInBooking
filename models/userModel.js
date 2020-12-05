var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

let db = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
    "bookings": [{
        "startDate": Date,
        "endDate": Date,
        "roomID": String,
        "roomName": String,
        "roomCity": String,
        "roomImage": String,
        "roomPrice": Number,
        "totalDays": Number,
        "totalPrice": Number,
        "guests": Number
    }]
});

const userModel = db.model("users", UserSchema); 
module.exports = userModel;