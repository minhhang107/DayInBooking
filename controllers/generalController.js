var express = require("express");
var router = express.Router();
var roomModel = require("../models/roomModel");

router.get("/", function (req, res) {
  res.render("index", { user: req.session.user });
});

router.get("/search-result", function (req, res) {
  // res.render("search-results", { user: req.session.user });
  roomModel
      .find()
      .lean()
      .exec()
      .then((rooms) => {
          res.render("search-results", {
            rooms: rooms,
            city: req.body.city,
            user: req.session.user,
          });
        })
});

router.post("/search-result", (req, res) => {
    roomModel
      .find({ city: req.body.city })
      .lean()
      .exec()
      .then((rooms) => {
          console.log(rooms);
          res.render("search-result", {
            rooms: rooms,
            city: req.body.city,
            user: req.session.user,
          });
        })
});

router.get("/room-details", function (req, res) {
  res.render("room-details", { user: req.session.user });
});

router.get("/room-details/:roomID", function (req, res) {
  roomModel
    .findById(req.params.roomID)
    .lean()
    .exec()
    .then((room) => {
      res.render("room-details", { room: room, user: req.session.user });
    });
});

router.get("/log-in", function (req, res) {
  if (req.session.user) {
    if (req.session.user.isAdmin)
      res.render("admin-dashboard", { user: req.session.user });
    else if (!req.session.user.isAdmin)
      res.render("user-dashboard", { user: req.session.user });
  } else res.render("log-in", { user: req.session.user });
});

router.get("/sign-up", function (req, res) {
  res.render("sign-up", { user: req.session.user });
});

module.exports = router;
