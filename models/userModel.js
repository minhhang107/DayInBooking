const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

let db = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new Schema({
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


module.exports = db.model("users", UserSchema); ;