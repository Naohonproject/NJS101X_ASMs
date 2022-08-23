// exports.getStaffInfor = (req, res, next) => {};

// const RollCall = require("../model/rollCall");

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

exports.getStaffRollCallForm = (req, res, next) => {
  let status = "off";
  console.log(req.staff.name);
  if (req.staff.workSesstions.length === 0) {
    res.render("rollCall", {
      pageTitle: "rollCall",
      path: "/rollcall",
      staffName: req.staff.name,
      status: status,
      checkIn: "",
      workPos: "",
      checkOut: "",
      annualLeave: req.staff.annualLeave,
    });
  } else {
    const lastWorkSesstionIndex = req.staff.workSesstions.length - 1;
    const lastWorkSesstion = req.staff.workSesstions[lastWorkSesstionIndex];

    status = lastWorkSesstion.checkOut ? "off" : "on";

    const checkInTime = new Date(lastWorkSesstion.checkIn);
    const localCheckInTime = checkInTime.toLocaleTimeString();

    const checkOutTime = new Date(lastWorkSesstion.checkOut);
    const localCheckOutTime = checkOutTime.toLocaleTimeString();

    res.render("rollCall", {
      pageTitle: "rollCall",
      path: "/rollcall",
      staffName: req.staff.name,
      status: status,
      checkIn: localCheckInTime,
      workPos: lastWorkSesstion.workPos,
      checkOut: localCheckOutTime,
      annualLeave: req.staff.annualLeave,
    });
  }
};

exports.postStaffCheckIn = (req, res, next) => {
  const workPostion = req.body.workPosition;
  const checkIn = Date.now();
  const workSesstion = {
    checkIn: checkIn,
    workPos: workPostion,
  };

  req.staff.workSesstions.push(workSesstion);

  req.staff
    .save()
    .then(() => {
      res.redirect("/rollcall");
    })
    .catch((error) => console.log(error));
};

// exports.getStaffCheckIn = (req, res, next) => {
//   req.user
//     .populate("rollCall")
//     .then((user) => {
//       res.redirect("/rollcall");
//     })
//     .catch((error) => console.log(error));
// };

exports.postStaffCheckout = (req, res, next) => {
  const lastWorkSesstionIndex = req.staff.workSesstions.length - 1;
  req.staff.workSesstions[lastWorkSesstionIndex].checkOut = Date.now();

  req.staff
    .save()
    .then(() => {
      res.redirect("/rollcall/infor");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getStaffRollCallInfor = (req, res, next) => {
  const workSestions = req.staff.workSesstions;
  const workSesstionToday = workSestions.filter((workSession) =>
    isToday(workSession.checkIn)
  );

  const workTimeOfSesstion = workSesstionToday.map((workSesstion) => {
    const checkInTime = new Date(workSesstion.checkIn);
    const checkOutTime = new Date(workSesstion.checkOut);
    const duration = Number(
      ((checkOutTime - checkInTime) / 3600000).toFixed(2)
    );
    return duration;
  });

  const totalWorkTime = workTimeOfSesstion.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  const lastWorkSesstionIndex = req.staff.workSesstions.length - 1;
  const lastWorkSesstion = req.staff.workSesstions[lastWorkSesstionIndex];

  const status = lastWorkSesstion.checkOut ? "off" : "on";

  res.render("workSesstion", {
    staffName: req.staff.name,
    status: status,
    totalWorkTime: totalWorkTime,
    rollCalls: workSesstionToday.map((rc) => {
      const checkIn = new Date(rc.checkIn);
      const checkOut = new Date(rc.checkOut);
      return {
        checkIn: checkIn.toLocaleTimeString(),
        checkOut: checkOut.toLocaleTimeString(),
        position: rc.workPos,
      };
    }),
    pageTitle: "All Work Sesstion",
    path: "/rollcall",
    annualLeave: req.staff.annualLeave,
  });
};

exports.postAnnualLeaveForm = (req, res, next) => {
  console.log(req.body);
  const leaveDuration = Number(req.body.duration);
  const leaveDate = new Date(req.body.leaveDate);

  req.staff.annualLeave = req.staff.annualLeave - leaveDuration / 8;

  const leaveInfor = {
    dayOff: leaveDate,
    reason: req.body.reasonDesc,
    duration: leaveDuration / 8,
  };
  req.staff.annualLeaveRegisters.push(leaveInfor);

  req.staff
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};

exports.getStaffProfile = (req, res, next) => {
  res.render("profile", {
    pageTitle: "profile",
    path: "/profile",
    id: req.staff._id,
    name: req.staff.name,
    doB: req.staff.doB.toLocaleDateString(),
    startDate: req.staff.startDate.toLocaleDateString(),
    salaryScale: req.staff.salaryScale,
    department: req.staff.department,
    annualLeave: req.staff.annualLeave,
    imgUrl: req.staff.imageUrl,
  });
};

exports.postUpdatedProfile = (req, res, next) => {
  const updatedImageUrl = req.body.imgUrl;
  req.staff.imageUrl = updatedImageUrl;
  req.staff
    .save()
    .then(() => {
      res.redirect("/profile");
    })
    .catch((error) => console.log(error));
};

exports.getCovidInforForms = (req, res, next) => {
  res.render("covid", {
    pageTitle: "Covid Infor",
    path: "/covid",
  });
};

exports.getWorkInformation = (req, res, next) => {
  const workInfor = req.staff.workSesstions.map((workSesstion) => {
    const workSesstionDuration = workSesstion.checkOut
      ? Number(
          ((workSesstion.checkOut - workSesstion.checkIn) / 3600000).toFixed(2)
        )
      : null;

    return {
      date: workSesstion.checkIn.toLocaleDateString(),
      checkIn: workSesstion.checkIn.toLocaleTimeString(),
      checkOut: workSesstion.checkOut
        ? workSesstion.checkOut.toLocaleTimeString()
        : null,
      duration: workSesstionDuration,
    };
  });
  console.log(workInfor);
  res.render("workInfor", {
    pageTitle: "Work Infor",
    path: "/workinfor",
  });
};
