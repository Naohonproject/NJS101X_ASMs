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
      // staff with input email not existed in db, redirect to log in page, return that and the below code will not be run,
      // if not code execute normally
      if (!staff) {
        req.flash("error", "Invalid email or Password");
        return res.redirect("/login");
      }
      // this func compare input password to hashed password(was stored in db with staff email)
      // return a promise, with boolean go into then, true if match, false is not matching
      bscrypt
        .compare(password, staff.password)
        .then((isMatch) => {
          if (isMatch) {
            // if match , create a session for this staff(the match staff with matched email and password)
            req.session.isLoggedIn = true;
            req.session.staff = staff;
            // save the session ,then redirect to homepage
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          // if no user match email and password, create a flash error then redirect to log-in page to show error in log-in page and
          // let user log-in agian
          req.flash("error", "Invalid email or Password");
          res.redirect("/login");
        })
        .catch((error) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.postLogOut = (req, res, next) => {
  // delete the session with sessionId that matches sessionId stored in cookie of postLogout request
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
