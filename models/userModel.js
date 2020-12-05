const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

let db = mongoose.createConnection("mongodb+srv://mhnguyen16:Web3222020@cluster0.oobyl.mongodb.net/DayIn?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

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