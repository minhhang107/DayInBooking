const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

let db = mongoose.createConnection("mongodb+srv://mhnguyen16:Web3222020@cluster0.oobyl.mongodb.net/DayIn?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const RoomSchema = new Schema({
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

const roomModel =  db.model("rooms", RoomSchema);
module.exports = roomModel;