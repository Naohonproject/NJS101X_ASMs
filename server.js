const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const checkRouter = require("./routers/rollCall");
const profileRouter = require("./routers/profile");
const covidRouter = require("./routers/covid");
const annualLeaveRouter = require("./routers/leave");
const workInforRouter = require("./routers/workinfor");

const staffController = require("./controllers/staffControllers");
const Staff = require("./model/staffModel");

const server = express();
const port = 3000;

server.set("view engine", "ejs");
server.set("views", "views");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));

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

server.use("/rollcall", checkRouter);
server.use(profileRouter);
server.use(covidRouter);
server.use(workInforRouter);
server.use(annualLeaveRouter);
server.get("/", staffController.getIndex);

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
        user.save();
      }
      server.listen(port);
    });
  })
  .catch((error) => console.log(error));
