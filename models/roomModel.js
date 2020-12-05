var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");
let db=mongoose.createConnection("mongodb://localhost/DayIn", { useNewUrlParser: true, useUnifiedTopology: true });

var RoomModel = new Schema({
    "title": String,
    "type": String,
    "roomNums": Number,
    "description": String,
    "address": String,
    "city": String,
    "state": String,
    "postalCode": String,
    "price": Number,
    "image": String
});

module.exports = db.model("rooms", RoomModel);
