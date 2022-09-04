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

// create a server with express top level funtion
const server = express();
const store = new MongoDbStore({ uri: MONGODB_URI, collection: "sessions" });
const csrfProtection = csrf();

const dateStr = new Date().toISOString().replace(/:/g, "-");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.session.staff._id + "-" + file.originalname);
  },
});

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
server.set("views", "views");

// using middleware to parse request body to js object
server.use(bodyParser.urlencoded({ extended: false }));
// store file in storage that is in server folder

// defined the public folder,to be able to access css and other static file
server.use(express.static(path.join(__dirname, "public")));
// server the public image
server.use("/images", express.static(path.join(__dirname, "images")));

server.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
server.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

server.use(csrfProtection);

server.use(flash());

server.use((req, res, next) => {
  if (!req.session.staff) {
    return next();
  }
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      req.staff = staff;
      next();
    })
    .catch((err) => console.log(err));
});

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

// connect to the db on mongodb by using mongoose and connection string, then create a user if there is no user at all,if it has a user, no create more
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
        server.listen(port);
      });
  })
  .catch((error) => console.log(error));
