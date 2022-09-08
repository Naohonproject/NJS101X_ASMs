const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const bscrypt = require("bcryptjs");
const multer = require("multer");

// import routers, use routes as middleware by server.use
const checkRouter = require("./routers/rollCall");
const profileRouter = require("./routers/profile");
const covidRouter = require("./routers/covid");
const annualLeaveRouter = require("./routers/leave");
const workInforRouter = require("./routers/workinfor");
const salaryQueryRouter = require("./routers/salaryQuery");
const AuthRouter = require("./routers/auth");
const managerRouter = require("./routers/manager");

const staffController = require("./controllers/staffControllers");
// import model
const Staff = require("./model/staffModel");

const MONGODB_URI =
  "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/Company";

// create a server with express top level function
const server = express();
// init store to point where to store session, if not defined this , session is stored in memory (RAM), Then will be free after server off
// then user login information not exist in server anymore
const store = new MongoDbStore({ uri: MONGODB_URI, collection: "sessions" });
// create csrfProtection, this is a middleware to check incoming request have tho token we assign with post request or not,
// this will avoid the fake request outside of our website, because cookie hold our sessionId then for any request, browser will
// send sessionId in cookie with request header
const csrfProtection = csrf();

const dateStr = new Date().toISOString().replace(/:/g, "-");

// config where and how multer stores file from incoming request
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.session.staff._id + "-" + file.originalname);
  },
});

// config the file filter for multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

// declare and init port
const port = 3000;

// set config for view engine
server.set("view engine", "ejs");
// set config for folder that express find views to response to user
server.set("views", "views");

// using middleware to parse request body to js object
server.use(bodyParser.urlencoded({ extended: false }));

// defined the public folder,to be able to access css and other static file
server.use(express.static(path.join(__dirname, "public")));
// server the public image, server the public images
server.use("/images", express.static(path.join(__dirname, "images")));

// register the session middleware,this will create the object , that will contain information , connect requests by sessionId
// cause HTTP request is stateless, so that if we want request to share the information , we need to store something in server
// send make key, send it with response , browser store that data in cookie, then next request can access that information
// by take sessionId store in cookie, compare with session in server, this work flow will be done by session middleware
server.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// use multer middleware to convert the file data from multi data form in coming post request
server.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// use csurf middleware to verify the post request, this will make the token and store in session, this token will be sent along
// responses then in the view , we  add this token in the form, when client send the post request, this token comes along the request
// then csrfProtection middleware will check the match of token in server session with token client send with the form
server.use(csrfProtection);

// use flash middleware to catch the error then store it in session until the next request
server.use(flash());

// middleware to authenticate user, if in the cookie attached to request ,
// that determine whether client have right to reach some routes or not
server.use((req, res, next) => {
  // if client have sessionId in cookie, next to next middleware to access the no need log-in routes
  if (!req.session.staff) {
    return next();
  }
  // if user logged in , then incoming request, we assign that user information in incoming request
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      req.staff = staff;
      next();
    })
    .catch((err) => console.log(err));
});

// make the global variable for all responses, that can use in all view without passing it from the res.render function
server.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.staff = req.session.staff;
  next();
});

// use routers
server.use("/rollcall", checkRouter);
server.use(profileRouter);
server.use(covidRouter);
server.use(workInforRouter);
server.use(annualLeaveRouter);
server.use(salaryQueryRouter);
server.use(AuthRouter);
server.use(managerRouter);
server.get("/", staffController.getIndex);
server.use(staffController.getErrorPage);

// register middleware to receive error from previous middleware sent by next function then render the error page
server.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
  });
});

// connect to the db on mongodb by using mongoose and connection string,
// then create a user if there is no user at all,if it has a user, no create more
// use bscrypt to hash password of user
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    Staff.findOne()
      .then((staff) => {
        if (!staff) {
          const pass = "123456";
          return bscrypt.hash(pass, 12).then((encryptedPassword) => {
            const staff = new Staff({
              name: "le tuan bao",
              email: "Letuanbao27121996@gmail.com",
              password: encryptedPassword,
              role: "staff",
              doB: new Date("1996-12-27"),
              salaryScale: 4.0,
              startDate: new Date("2019-12-01"),
              department: "Piping",
              annualLeave: 12,
              imageUrl: "images/2022-09-03T03-19-48.480Z-1112.jpg",
              workSessions: [],
              annualLeaveRegisters: [],
              tempInfor: [],
              vaccinationInfor: [],
              positiveCovid: [],
            });
            return staff.save();
          });
        }
      })
      .then(() => {
        Staff.findOne({ role: "manager" }).then((staff) => {
          const pass = "111111";
          if (!staff) {
            return bscrypt.hash(pass, 12).then((encryptedPassword) => {
              const staff = new Staff({
                name: "Le Quoc Dat",
                email: "ltb.199x@outlook.com",
                role: "manager",
                password: encryptedPassword,
                tempInfor: [],
                vaccinationInfor: [],
                positiveCovid: [],
              });
              return staff.save();
            });
          }
        });
      })
      .then(() => {
        // listen incoming request for the PORT that declared as environment variable or 8080 port
        server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
          console.log("server is running");
        });
      });
  })
  .catch((error) => console.log(error));
