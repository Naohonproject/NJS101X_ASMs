exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

exports.isStaff = (req, res, next) => {
  if (!req.session.staff.role === "staff") {
    return res.redirect("/");
  }
  next();
};
