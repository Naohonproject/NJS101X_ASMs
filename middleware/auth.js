// middleware to check client is authenticated or not
exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

// middleware to check where the client is staff or not
exports.isStaff = (req, res, next) => {
  if (!req.session.staff.role === "staff") {
    return res.redirect("/");
  }
  next();
};
