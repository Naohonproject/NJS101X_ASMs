// exports.getStaffInfor = (req, res, next) => {};
const RollCall = require("../model/rollCall");

const isToday = (date) => {
  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
};

exports.getIndex = (req, res, next) => {
  res.render("index", {
    pageTitle: "index",
    path: "/",
  });
};

exports.getStaffCheckInForm = (req, res, next) => {
  req.user
    .populate("rollCall")
    .then((user) => {
      const lastRollCallIndex = user.rollCall.length - 1;
      const lastRollCall = user.rollCall[lastRollCallIndex];
      const status = lastRollCall.checkOut ? "off" : "on";
      res.render("rollCall", {
        pageTitle: "rollCall",
        path: "/rollcall",
        userName: user.name,
        status: status,
        workAt: lastRollCall.workPosition,
        startTime: lastRollCall.checkIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postStaffCheckIn = (req, res, next) => {
  const workPostion = req.body.workPostion;
  const checkIn = Date.now();
  const userId = req.user._id;

  const rollcall = new RollCall({
    checkIn: checkIn,
    workPosition: workPostion,
    userId: userId,
  });
  rollcall
    .save()
    .then((result) => {
      return req.user.addToRollCall(rollcall);
    })
    .then(() => {
      res.redirect("/rollcall");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getStaffCheckIn = (req, res, next) => {
  req.user
    .populate("rollCall")
    .then((user) => {
      res.redirect("/rollcall");
    })
    .catch((error) => console.log(error));
};

exports.postStaffCheckout = (req, res, next) => {
  const lastRollCallIndex = req.user.rollCall.length - 1;
  const lastRollCallId = req.user.rollCall[lastRollCallIndex].toString();
  RollCall.findById(lastRollCallId)
    .then((rollcall) => {
      rollcall.checkOut = Date.now();
      return rollcall.save();
    })
    .then(() => {
      res.redirect("/rollCall/infor");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getStaffRollCallInfor = (req, res, next) => {
  req.user
    .populate("rollCall")
    .then((user) => {
      const rollCallsToday = user.rollCall.filter((rollcall) => {
        return isToday(rollcall.checkIn);
      });
      const workTimeOfRollCall = rollCallsToday.map((rollcall) => {
        const checkInTime = new Date(rollcall.checkIn);
        const checkOutTime = new Date(rollcall.checkOut);
        const duration = Number(
          ((checkOutTime - checkInTime) / 3600000).toFixed(2)
        );
        return duration;
      });

      const totalWorkTime = workTimeOfRollCall.reduce((prev, curr) => {
        return prev + curr;
      }, 0);

      res.render("workSesstion", {
        totalWorkTime: totalWorkTime,
        rollCalls: rollCallsToday.map((rc) => {
          return {
            checkIn: rc.checkIn,
            checkOut: rc.checkOut,
            position: rc.workPosition,
          };
        }),
        pageTitle: "All Work Sesstion",
        path: "/rollcall",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAnnualLeaveForm = (req, res, next) => {};
