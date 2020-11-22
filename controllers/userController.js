var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userModel = require("../models/userModel.js");
var roomModel = require("../models/roomModel.js");
// var validationController = require("./validationController");
var nodemailer = require("nodemailer");
var bcrypt = require("bcrypt-nodejs");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mh.web322@gmail.com",
    pass: "web/322/",
  },
});

var usersControllers = {
  searchRooms(req, res) {
    // receive the city
    const city = req.city;
    // search for rooms in city and store in an array
    const rooms = roomModel.find({ city: req.body.city });

    // display rooms
    if (rooms.length === 0) {
      res.render("search-result", { city: city });
    } else {
      res.render("search-result", { city: city });
    }
  },

  async addUser(req, res) {
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
                      console.log(
                        `${FORM_DATA.usrname} was saved successfully`
                      );

                      // redirect to dashboard
                      res.render("dashboard", {
                        firstName: newUser.fname,
                        lastName: newUser.lname,
                        layout: false,
                      });

                      // send email
                      var emailOptions = {
                        from: "mh.web322@gmail.com",
                        to: FORM_DATA.email,
                        subject: "Welcome to DayIn!",
                        html:
                          "<p>Hello " +
                          FORM_DATA.fname +
                          ",</p><p>Welcome to DayIn!<p/><p>You're now a part of our community that connects global travellers with local hosts throughout Canada. Now you can find a place to stay or share your amazing home with visitors.</p><p>Please click <a href='#'>here</a> to verify your account.</p>",
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
                    layout: false,
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
              layout: false,
            });
          }
        })
        .catch((err) => {
          console.log(`An error occurs: ${err}`);
        });
    }
  },

  checkLogIn(req, res, next) {
    if (!req.session.user) {
      res.render("log-in", {
        error: "Unauthorized access, please log in",
        layout: false,
      });
    } else next();
  },

  logIn(req, res) {
    const FORM_DATA = req.body;
    var usernameBlank = false;
    var passwordBlank = false;

    if (FORM_DATA.username === "") {
      usernameBlank = true;
    }
    if (FORM_DATA.password === "") {
      passwordBlank = true;
    }

    if (usernameBlank || passwordBlank) {
      return res.render("log-in", {
        usernameBlank: usernameBlank,
        passwordBlank: passwordBlank,
        usernameError:
          "Username cannot be blank. Please enter a valid username",
        passwordError:
          "Password cannot be blank. Please enter a valid password",
      });
    } else {
    userModel
      .findOne({ username: FORM_DATA.username })
      .exec()
      .then((usr) => {
        if (!usr) {
          console.log("Cannot find user");
          return res.render("log-in", {
            noMatch: true,
            error: "Wrong username or password. Please try again.",
            layout: false,
          });
        } else {
          try {
            let compare = function () {
              return bcrypt.compare(FORM_DATA.password, usr.password);
            };

            compare()
            bcrypt.compare(FORM_DATA.password, usr.password)
              .then((matched) => {
                if (matched) {
                  req.session.user = {
                    username: usr.username,
                    password: usr.password,
                    isAdmin: usr.isAdmin,
                  };

                  // redirect to user/admin dashboard page
                  if (usr.isAdmin) {
                    res.render("admin-dashboard", {
                      firstName: usr.fname,
                      lastName: usr.lname,
                      layout: false,
                    });
                  } else {
                    res.render("user-dashboard", {
                      firstName: usr.fname,
                      lastName: usr.lname,
                      layout: false,
                    });
                  }
                } else {
                  console.log("Password does not match");
                  return res.render("log-in", {
                    noMatch: true,
                    error: "Wrong username or password. Please try again.",
                    layout: false,
                  });
                }
              })
              .catch((error) => {
                console.log(`An error occurs: ${error}`);
              });
          } catch (error) {
            console.log(`An error occurs: ${error}`);
          }
        }
      })
      .catch((error) => {
        console.log(`An error occurs: ${error}`);
      });
    }
  },
};

module.exports = usersControllers;
