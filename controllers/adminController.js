var roomModel = require("../models/roomModel");
var photoModel = require("../models/photoModel");
var express = require("express");
var multer = require("multer");
const _ = require("underscore");
const fs = require("fs");
const PHOTODIRECTORY = "./public/photos/";

if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

// const STORAGE = multer.diskStorage({
//     destination: "./public/photos/",
//     filename: function(req, file, cb){
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const UPLOAD = multer({storage: STORAGE});

//UPLOAD.single("photo")
var adminController = {
  checkAdminLogIn(req, res) {
    if (!req.session.user || !req.session.user.isAdmin) {
      res.render("log-in", {
        error: "Unauthorized access, only admin can access this page. Please log in as an admin.",
        layout: false,
      });
    } else next();
  },

  loadAdminDashboard(req, res) {
    const rooms = roomModel.find();
    res.render("admin-dashboard", {
      rooms: rooms,
      hasRooms: !!rooms.length,
      layout: false,
    });
  },

  uploadPhoto(req, res) {
    const locals = {
      message: "Your photo was uploaded successfully",
      layout: false,
    };

    const newPhoto = new photoModel({
      filename: req.file.filename,
    });

    newPhoto
      .save()
      .then((response) => {
        console.log("saved successfully");
        res.render("/upload-room", locals);
      })
      .catch((err) => {
        locals.message = "There was an error uploading your photo";
        console.log(err);
        res.render("/upload-room");
      });
  },

  addRoom(req, res) {
    const FORM_DATA = req.body;

    // create new room
    var newRoom = new roomModel({
      title: FORM_DATA.list-title,
      description: FORM_DATA.list - description,
      location: {
        address: FORM_DATA.list - street,
        city: FORM_DATA.list - city,
        state: FORM_DATA.list - state,
        postalCode: FORM_DATA.list - postal - code,
      },
      price: FORM_DATA.list - price,
      photos: true,
    });

    // save room
    newRoom.save((err) => {
      if (err) {
        console.log("There was an error creating new room");
      } else {
        console.log("New room was created successfully!");

        // redirect to dashboard
        res.render("dashboard", {
          firstName: FORM_DATA.fname,
          layout: false,
        });
      }
    });
  },

  deleteRoom(req, res) {
    const roomID = req.params._id;
    const photos = req.params.photos;

    roomModel.remove({_id : roomID})
    .then(()=>{
      photos.forEach((photo)=>{
        fs.unlink(PHOTODIRECTORY + photo.filename, (err)=>{
          if (err){
            return console.log(err);
          }
          console.log("Removed file: " + photo.filename);
        })
      });

      return res.redirect('/admin-dashboard');
    })
    .catch((err)=>{
      console.log(err);
      return res.redirect('/admin-dashboard');
    })
  },

  deletePhoto(req, res){
    const filename = req.params.filename;

    photoModel.remove({filename: filename})
    .then(()=>{
      fs.unlink(PHOTODIRECTORY + filename, (err)=>{
        if (err){
          return console.log(err);
        }
        console.log("Removed file: " + filename);
      })

      return res.redirect('/edit-room');
    })
    .catch((err)=>{
      console.log(err);
      return res.redirect('/edit-room');
    })
    

  }
};

module.exports = adminController;
