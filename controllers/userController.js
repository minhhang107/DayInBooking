const express = require("express");
const router = express.Router();
const session = require("express-session");
const clientSessions = require("client-sessions");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userModel = require("../models/userModel.js");
var nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");
const roomModel = require("../models/roomModel.js");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  ignoreTLS: false,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

var checkLogIn = function (req, res, next) {
  var errors = [];
  if (!req.session.user){
    errors.push("Unauthorized access. Please log in to continue.");
    res.render("log-in", {
      errors: errors,
      user: req.session.user,
    });
  } else next();
};

router.post("/sign-up", async function (req, res) {
  const FORM_DATA = req.body;

  // server side validation
  var validated = true;
  let usernameExisted = true;
  let emailExisted = true;
  const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z-]+\.[a-zA-Z]{2,3}$/;
  const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (
    FORM_DATA.usrname === "" ||
    FORM_DATA.fname === "" ||
    FORM_DATA.lname === "" ||
    FORM_DATA.email === "" ||
    !emailRegex.test(FORM_DATA.email) ||
    FORM_DATA.pwd === "" ||
    !pwdRegex.test(FORM_DATA.pwd)
  )
    validated = false;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(FORM_DATA.pwd, salt);

    var newUser = new userModel({
      username: FORM_DATA.usrname,
      fname: FORM_DATA.fname,
      lname: FORM_DATA.lname,
      email: FORM_DATA.email,
      password: hashedPassword,
    });
  } catch (err) {
    console.log(`An error occur: ${err}`);
  }

  if (validated === true) {
    userModel
      .findOne({ username: FORM_DATA.usrname })
      .exec()
      .then((user) => {
        if (!user) {
          usernameExisted = false;

          userModel
            .findOne({ email: FORM_DATA.email })
            .exec()
            .then((user) => {
              if (!user) {
                emailExisted = false;

                newUser.save((err) => {
                  if (err) {
                    console.log(
                      `There was an error saving ${FORM_DATA.usrname}:` + err
                    );
                  } else {
                    console.log(`${FORM_DATA.usrname} was saved successfully`);

                    // redirect to dashboard
                    res.render("dashboard", {
                      firstName: newUser.fname,
                      lastName: newUser.lname,
                      user: req.session.user,
                    });

                    // send email
                    var emailOptions = {
                      from: "mh.web322@gmail.com",
                      to: FORM_DATA.email,
                      subject: "Welcome to DayIn!",
                      html:
                        "<p>Hello " +
                        FORM_DATA.fname +
                        ",</p><p>Welcome to DayIn!<p/><p>You're now a part of our community that connects global travellers with local hosts throughout Canada. Now you can find a place to stay or share your amazing home with visitors.</p>",
                    };

                    transporter.sendMail(emailOptions, (error, info) => {
                      if (error) {
                        console.log("ERROR: " + error);
                      } else {
                        console.log("SUCCESS: " + info.response);
                      }
                    });
                  }
                });
              } else {
                res.render("sign-up", {
                  usernameExisted: usernameExisted,
                  emailExisted: emailExisted,
                  user: req.session.user,
                });
              }
            })
            .catch((err) => {
              console.log(`An error occurs: ${err}`);
            });
        } else {
          res.render("sign-up", {
            usernameExisted: usernameExisted,
            emailExisted: emailExisted,
            user: req.session.user,
          });
        }
      })
      .catch((err) => {
        console.log(`An error occurs: ${err}`);
      });
  }
});

router.get("/dashboard", function (req, res) {
  res.render("dashboard", checkLogIn, { user: req.session.user });
});

router.post("/log-in", function (req, res) {
  var errors = [];

  if (req.body.username === "") {
    errors.push("Username cannot be blank. Please enter a valid username");
  }
  if (req.body.password === "") {
    errors.push("Password cannot be blank. Please enter a valid password");
  }

  if (req.body.username === "" || req.body.password === "") {
    return res.render("log-in", { errors: errors });
  } else {
    userModel
      .findOne({ username: req.body.username })
      .exec()
      .then((usr) => {
        if (!usr) {
          console.log("Cannot find user");
          errors.push("Wrong username or password. Please try again.");
          return res.render("log-in", {
            errors: errors,
            user: req.session.user,
          });
        } else {
          try {
            // compare()
            bcrypt
              .compare(req.body.password, usr.password)
              .then((matched) => {
                if (matched) {
                  //redirect to user/admin dashboard page and set up session
                  req.session.user = {
                    id: usr._id,
                    username: usr.username,
                    email: usr.email,
                    fname: usr.fname,
                    lname: usr.lname,
                    password: usr.password,
                    isAdmin: usr.isAdmin,
                    bookings: usr.bookings,
                  };
                  if (usr.isAdmin) {
                    roomModel
                      .find()
                      .lean()
                      .exec()
                      .then((rooms) => {
                        res.render("admin-dashboard", {
                          rooms: rooms,
                          user: req.session.user,
                        });
                      });
                  } else {
                    userModel
                      .findById(req.session.user.id)
                      .lean()
                      .exec()
                      .then((usr) => {
                        res.render("user-dashboard", {
                          bookings: usr.bookings,
                          user: req.session.user,
                        });
                      });
                  }
                } else {
                  console.log("Password does not match");
                  errors.push("Wrong username or password. Please try again.");
                  return res.render("log-in", {
                    errors: errors,
                    user: req.session.user,
                  });
                }
              })
              .catch((error) => {
                console.log(`An error1 occurs: ${error}`);
              });
          } catch (error) {
            console.log(`An error2 occurs: ${error}`);
          }
        }
      })
      .catch((error) => {
        console.log(`An error3 occurs: ${error}`);
      });
  }
});

router.get("/user-dashboard", checkLogIn, function (req, res) {
  userModel
    .findById(req.session.user.id)
    .lean()
    .exec()
    .then((user) => {
      res.render("user-dashboard", {
        bookings: user.bookings,
        user: req.session.user,
      });
    });
});

router.get("/log-out", checkLogIn, (req, res) => {
  req.session.reset();
  res.redirect("/log-in");
});

router.get("/book-now", checkLogIn, function (req, res) {
  res.render("book-now", { user: req.session.user });
});

router.post("/book-now/:roomID", checkLogIn, function (req, res) {
  function days_between(date1, date2) {
    const milliseconds_a_day = 1000 * 60 * 60 * 24;
    const milliseconds_between = Math.abs(new Date(date1) - new Date(date2));
    return Math.round(milliseconds_between / milliseconds_a_day);
  }

  const totalDays = days_between(req.body.checkIn, req.body.checkOut);

  roomModel
    .findById(req.params.roomID)
    .lean()
    .exec()
    .then((room) => {
      var booking = {
        startDate: req.body.checkIn,
        endDate: req.body.checkOut,
        roomID: room._id,
        roomName: room.title,
        roomCity: room.city,
        roomImage: room.image,
        roomPrice: room.price,
        totalDays: totalDays,
        totalPrice: totalDays * room.price,
        guests: req.body.guests,
        user: req.session.user.id,
      };
      res.render("book-now", { booking: booking, user: req.session.user });
    });
});

router.get("/confirm", checkLogIn, function (req, res) {
  res.render("confirm", { user: req.session.user });
});

router.post("/confirm/:roomID", checkLogIn, function (req, res) {
  var newBooking = {
    startDate: req.body.checkIn,
    endDate: req.body.checkOut,
    roomID: req.body.roomID,
    roomName: req.body.roomName,
    roomCity: req.body.roomCity,
    roomImage: req.body.roomImage,
    roomPrice: req.body.roomPrice,
    totalDays: req.body.totalDays,
    totalPrice: req.body.totalPrice,
    guests: req.body.guests,
    user: req.session.user.id,
  };

  userModel
    .updateOne(
      { _id: req.session.user.id },
      {
        $push: { bookings: newBooking },
      }
    )
    .exec()
    .then((err) => {
      // render confirm page
      res.render("confirm", { title: newBooking.roomName, user: req.session.user });

      // send confirmation email
      var emailOptions = {
        from: process.env.EMAIL,
        to: req.session.user.email,
        subject: "Booking confirmation",
        html:
          "<p>Hello " +
          req.session.user.fname +
          " " +
          req.session.user.lname +
          ",</p><p>Your booking was successful!<p/><p>Thank you for choosing to stay with us. Below are the details of your booking:</p><div>You're staying at <i>" +
          newBooking.roomName +
          "</i> from " +
          newBooking.startDate +
          " to " +
          newBooking.endDate +
          ".</div><div>Total price: $" +
          newBooking.totalPrice +
          "</div>",
      };

      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.log("ERROR: " + error);
        } else {
          console.log("SUCCESS: " + info.response);
        }
      });
    })
    .catch((err) => {
      console.log("An error occurs: " + err);
    });
});



router.post("/search-results/", function (req, res) {
  roomModel
    .find({ city: req.body.city })
    .lean()
    .exec()
    .then((rooms) => {
      res.render("search-results", {
        city: req.body.city,
        rooms: rooms,
        user: req.session.user,
      });
    });
});
module.exports = router;
