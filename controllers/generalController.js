var express = require("express");
const { runInNewContext } = require("vm");
var router = express.Router();
var roomModel = require("../models/roomModel");

router.get("/", function (req, res) {
  res.render("index", { user: req.session.user });
});

router.get("/search-result", function (req, res) {
  res.render("search-result", { user: req.session.user });
});

router.post("/search-result/:city", (req, res) => {
  // search for rooms in city and store in an array
  if (req.body.city === "") {
    res.render("search-result", {
      error: "Please enter a location",
      user: req.session.user,
    });
  } else {
    roomModel
      .find({ city: req.body.city })
      .exec()
      .then((rooms) => {
        if (rooms.length === 0) {
          res.render("search-result", {
            error: "There are no rooms available",
            city: req.body.city,
            user: req.session.user,
          });
        } else {
          res.render("search-result", {
            roomsList: rooms,
            city: req.body.city,
            user: req.session.user,
          });
        }
      });
  }
});

router.get("/room-details", function (req, res) {
  res.render("room-details", { user: req.session.user });
});

router.get("/log-in", function (req, res) {
  res.render("log-in", { user: req.session.user });
});

router.get("/sign-up", function (req, res) {
  res.render("sign-up", { user: req.session.user });
});

module.exports = router;
