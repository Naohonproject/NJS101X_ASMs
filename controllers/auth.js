const bscrypt = require("bcryptjs");
const Staff = require("../model/staffModel");

exports.getLogIn = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "log In",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Staff.findOne({ email: email })
    .then((staff) => {
      // staff with input email not existed in db, redirect to log in page, return that and the below code will not be run,if not code excute normally
      if (!staff) {
        req.flash("error", "Invalid email or Password");
        return res.redirect("/login");
      }
      // this func compare input password to hashed password(was store in db with staff mail) return a promise , with boolean go into then , true if match, false is not matching
      bscrypt
        .compare(password, staff.password)
        .then((isMatch) => {
          if (isMatch) {
            // if match , create a session for this staff(the match staff with matched email and password)
            req.session.isLoggedIn = true;
            req.session.staff = staff;
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or Password");
          res.redirect("/login");
        })
        .catch((error) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
