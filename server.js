const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const checkRouter = require("./routers/rollCall");
const profileRouter = require("./routers/profile");
const covidRouter = require("./routers/covid");
// const annualLeaveRouter = require("./routers/leave");

const staffController = require("./controllers/staff");
const User = require("./model/user");

const server = express();
const port = 3000;

server.set("view engine", "ejs");
server.set("views", "views");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));

server.use((req, res, next) => {
  User.findById("6300ee71a52b842856c7edae")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

server.use("/rollcall", checkRouter);
server.use(profileRouter);
server.use(covidRouter);
// server.use("/search", searchRouter);
// server.use(annualLeaveRouter);
server.get("/", staffController.getIndex);

mongoose
  .connect(
    "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/Company?retryWrites=true&w=majority"
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "le tuan bao",
          email: "Letuanbao27121996@gmail.com",
          doB: new Date("1996-12-27"),
          salaryScale: 4.0,
          startDate: new Date("2019-12-01"),
          department: "piping",
          annualLeave: 12,
          imageUrl: "https://unsplash.com/s/photos/personal-assistant",
          rollCall: [],
        });
        user.save();
      }
      server.listen(port);
    });
  })
  .catch((error) => console.log(error));
