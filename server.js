const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

// import routers, use routes as middleware by server.use
const checkRouter = require("./routers/rollCall");
const profileRouter = require("./routers/profile");
const covidRouter = require("./routers/covid");
const annualLeaveRouter = require("./routers/leave");
const workInforRouter = require("./routers/workinfor");
const salaryQueryRouter = require("./routers/salaryQuery");

const staffController = require("./controllers/staffControllers");
// import model
const Staff = require("./model/staffModel");

// create a server with express top level funtion
const server = express();

// declare and init port
const port = 3000;

// set config for view engine
server.set("view engine", "ejs");
server.set("views", "views");

// using middileware to parse request body to js object
server.use(bodyParser.urlencoded({ extended: false }));

// difined the public folder,to be able to access css and other static file
server.use(express.static(path.join(__dirname, "public")));

// assume that there is a user,who signed in successfully then add database of that user to incoming request
server.use((req, res, next) => {
  Staff.findById("6303ec75723bbc2170c45d47")
    .then((staff) => {
      req.staff = staff;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

// use routers
server.use("/rollcall", checkRouter);
server.use(profileRouter);
server.use(covidRouter);
server.use(workInforRouter);
server.use(annualLeaveRouter);
server.use(salaryQueryRouter);
server.get("/", staffController.getIndex);
server.use(staffController.getErrorPage);

// connect to the db on mongodb by using mongoose and connection string, then create a user if there is no user at all,if it has a user, no create more
mongoose
  .connect(
    "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/Company?retryWrites=true&w=majority"
  )
  .then(() => {
    Staff.findOne().then((staff) => {
      if (!staff) {
        const user = new Staff({
          name: "le tuan bao",
          email: "Letuanbao27121996@gmail.com",
          role: "staff",
          doB: new Date("1996-12-27"),
          salaryScale: 4.0,
          startDate: new Date("2019-12-01"),
          department: "Piping",
          annualLeave: 12,
          imageUrl: "https://unsplash.com/s/photos/personal-assistant",
          workSesstions: [],
          annualLeaveRegisters: [],
          tempInfor: [],
          vaccinationInfor: [],
          postiveCodvid: [],
        });
        staff.save();
      }

      // after connect to mongodb successfully, let server listen the incoming request on port(that's 3000)
      server.listen(port);
    });
  })
  .catch((error) => console.log(error));
