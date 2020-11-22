var userModel = require("../models/userModel.js");

var validationController = {
    validateUsername(newUsername) {
        var available = false;
        userModel
          .findOne({ username: newUsername })
          .exec()
          .then((usr) => {
            if (!usr) {
              available = true;
            } else {
              console.log(
                "The username has been in use already. Please choose another username."
              );
            }
          })
          .catch((err) => {
            console.log(`There was an error: ${err}`);
          });
        return available;
      },
    
      validateEmail(newEmail) {
        var available = false;
        userModel
          .findOne({ email: newEmail })
          .exec()
          .then((usr) => {
            if (!usr) {
              available = true;
            } else {
              console.log(
                "The email has been in use already. Please choose another username."
              );
            }
          })
          .catch((err) => {
            console.log(`There was an error: ${err}`);
          });
        return available;
      },
}


module.exports = validationController;