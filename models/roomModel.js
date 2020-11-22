var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
let db=mongoose.createConnection("mongodb://localhost/DayIn", { useNewUrlParser: true, useUnifiedTopology: true });
var PhotoModel = new Schema({
    "filename":{
        type: String,
        unique: true
    },
    "createdOn":{
        type: Date,
        default: Date.now
    }
})


var RoomModel = new Schema({
    "title": String,
    "description": String,
    "address": String,
    "city": String,
    "state": String,
    "postalCode": String,
    "price": Number,
    "photos": [PhotoModel]
});

module.exports = db.model("Rooms", RoomModel);
