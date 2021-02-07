var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
const _ = require("underscore");
const { Mongoose, get } = require("mongoose");
var roomModel = require("../models/roomModel");
const { Promise } = require("bluebird");
const fs = require("fs");
const PHOTODIRECTORY = "./public/photos/";

if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

const STORAGE = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const UPLOAD = multer({ storage: STORAGE });

var checkAdminLogIn = function (req, res, next) {
  var errors = [];
  if (!req.session.user){
    errors.push( "Unauthorized access. Please log in to continue.")
    res.render("log-in", {
      errors: errors,
      user: req.session.user,
    });
  } else{
      if (!req.session.user.isAdmin){
        errors.push("Unauthorized access, only admin can access this page. Please log in as an admin.");
        res.render("log-in", {
          errors: errors,
          user: req.session.user,
        });
      }   
      else next();
  } 
};

// routes
router.get("/admin-dashboard", checkAdminLogIn, function (req, res) {
  roomModel
    .find()
    .lean()
    .exec()
    .then((rooms) => {
      res.render("admin-dashboard", {
        rooms: rooms,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log("ERROR: " + err);
    });
});

router.get("/upload-room", checkAdminLogIn, function (req, res) {
  res.render("upload-room", { user: req.session.user });
});

router.post(
  "/room-details",
  checkAdminLogIn,
  UPLOAD.single("photo"),
  (req, res) => {

  
    // create new room
    var newRoom = new roomModel({
      title: req.body.listTitle,
      type: req.body.listType,
      roomNums: req.body.listRoomNums,
      description: req.body.listDescriptionContent,
      address: req.body.listStreet,
      city: req.body.listCity,
      state: req.body.listState,
      postalCode: req.body.listPostalCode,
      price: req.body.listPrice,
      image: req.file.filename,
    });
    
    newRoom
      .save()
      .then((thisRoom) => {
        console.log("New room was created successfully!");

        roomModel
          .findOne({ _id: thisRoom._id })
          .lean()
          .exec()
          .then((room) => {
            
            

            res.render("room-details", { room: room, user: req.session.user });
          })
          .catch((err) => {
            console.log(`Error finding room: ${err}`);
          });
      })
      .catch((err) => {
        console.log(`Error saving room: ${err}`);
      });
  }
);

router.get("/edit-room/:roomID", checkAdminLogIn, (req, res) => {
  roomModel
    .findById(req.params.roomID)
    .lean()
    .exec()
    .then((room) => {
      res.render("edit-room", {
        room: room,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log("ERROR: " + err);
    });
});

router.post(  "/room-details/:roomID",  checkAdminLogIn,  UPLOAD.single("photo"),  (req, res) => {
    var photo = "";
    const title = req.body.listTitle;
    const type = req.body.listType;
    const roomNums = req.body.listRoomNums;
    const description = req.body.listDescription;
    const address = req.body.listStreet;
    const city = req.body.listCity;
    const state = req.body.listState;
    const postalCode = req.body.listPostalCode;
    const price = req.body.listPrice;
    
    if (req.file) {
      photo = req.file.filename;
    } else photo = req.body.image;

    roomModel
      .updateOne(
        { _id: req.params.roomID },
        {
          $set: {
            title: title,
            type: type,
            roomNums: roomNums,
            description: description,
            address: address,
            city: city,
            state: state,
            postalCode: postalCode,
            price: price,
            image: photo,
          },
        }
      )
      .exec()
      .then((err) => {
        roomModel
          .findById(req.params.roomID)
          .lean()
          .exec()
          .then((room) => {
            if (room.image === "") {
              res.render("edit-room", {
                error: "You must upload a photo for your room",
                room: room,
                user: req.session.user,
              });
            } else {
              res.render("room-details", {
                room: room,
                user: req.session.user,
              });
            }
          });
      });
  }
);

router.post("/edit-room/:roomID", checkAdminLogIn, (req, res) => {
  const filename = req.body.photo;

  roomModel
    .updateOne({ image: filename }, { $set: { image: "" } })
    .exec()
    .then(() => {
      fs.unlink(PHOTODIRECTORY + filename, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Removed photo : " + filename);
      });
      console.log("Room updated");

      roomModel
        .findById(req.params.roomID)
        .lean()
        .exec()
        .then((room) => {
          res.render("edit-room", { room: room, user: req.session.user });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.redirect("/");
    });
});

router.post("/admin-dashboard", checkAdminLogIn, (req, res) => {
  const roomID = req.body.id;
  const roomName = req.body.title;
  const filename = req.body.photo;
  
        //unlink photo from folder
  if(filename!==""){
    fs.unlink(PHOTODIRECTORY + filename, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Removed photo : " + filename);
    });
  }

  // remove room
  roomModel
    .remove({ _id: roomID })
    .then(() => {
      console.log("Room removed");
     
      roomModel
        .find()
        .lean()
        .exec()
        .then((rooms) => {
          res.render("admin-dashboard", {
            deletedRoom: roomName,
            rooms: rooms,
            user: req.session.user,
          });
        });
    })
    .catch((err) => {
      console.log(`An error occurs while deleting room: ${err}`);
      res.render("admin-dashboard", { user: req.session.user });
    });
});

module.exports = router;
