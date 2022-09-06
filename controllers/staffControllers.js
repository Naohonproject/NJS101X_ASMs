const { validationResult } = require("express-validator");

// import the sub functions firm utils folder
const { isToday, getUnique, getWorkSessionInfor } = require("../utils/subFunc");
const Staff = require("../model/staffModel");
const fileHelp = require("../utils/file");

// controller render home page
exports.getIndex = (req, res, next) => {
  res.render("index", {
    pageTitle: "index",
    path: "/",
  });
};

// controller to render rollcall page
exports.getStaffRollCallForm = (req, res, next) => {
  let status = "off";
  if (req.staff.workSessions.length === 0) {
    res.render("rollCall", {
      pageTitle: "rollCall",
      path: "/rollcall",
      staffName: req.staff.name,
      status: status,
      checkIn: "",
      workPos: "",
      checkOut: "",
      annualLeave: req.staff.annualLeave,
      errorMessage: null,
    });
  } else {
    const lastWorkSessionIndex = req.staff.workSessions.length - 1;
    const lastWorkSession = req.staff.workSessions[lastWorkSessionIndex];

    status = lastWorkSession.checkOut ? "off" : "on";

    const checkInTime = new Date(lastWorkSession.checkIn);
    const localCheckInTime = checkInTime.toLocaleTimeString();

    const checkOutTime = new Date(lastWorkSession.checkOut);
    const localCheckOutTime = checkOutTime.toLocaleTimeString();

    res.render("rollCall", {
      pageTitle: "rollCall",
      path: "/rollcall",
      staffName: req.staff.name,
      status: status,
      checkIn: localCheckInTime,
      workPos: lastWorkSession.workPos,
      checkOut: localCheckOutTime,
      annualLeave: req.staff.annualLeave,
      errorMessage: null,
    });
  }
};

// controller to post staff checkin to db, then save it , after that rerender roll call page to update new status of staff working status
exports.postStaffCheckIn = (req, res, next) => {
  const workPostion = req.body.workPosition;
  const checkIn = Date.now();
  const workSession = {
    checkIn: checkIn,
    workPos: workPostion,
  };

  req.staff.workSessions.push(workSession);

  req.staff
    .save()
    .then(() => {
      res.redirect("/rollcall");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// post staff checkout then render the infor of all rollcalls of this day(realtime)
exports.postStaffCheckout = (req, res, next) => {
  const lastWorkSessionIndex = req.staff.workSessions.length - 1;
  req.staff.workSessions[lastWorkSessionIndex].checkOut = Date.now();

  req.staff
    .save()
    .then((updatedStaff) => {
      const lastWorkSession = updatedStaff.workSessions[lastWorkSessionIndex];
      console.log(lastWorkSession.checkIn.getDate());
      console.log(lastWorkSession.checkOut.getDate());
      if (
        lastWorkSession.checkIn.getDate() !== lastWorkSession.checkOut.getDate()
      ) {
        req.flash(
          "error",
          "Your last check-in and this check-out turn is not the same day.This work session is invalid.Contact your manager to solve this problem"
        );
      }
      res.redirect("/rollcall/infor");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// get all the rollcall of today, then render it to views
exports.getStaffRollCallInfor = (req, res, next) => {
  // get error of the last request

  const errorMessage = req.flash("error");

  const workSessions = req.staff.workSessions;
  // filter from all work session ,by using isToday function to filter the works sessions
  const workSessionToday = workSessions.filter((workSession) =>
    isToday(workSession.checkIn)
  );

  const workTimeOfSession = workSessionToday.map((workSession) => {
    const duration = Number(
      ((workSession.checkOut - workSession.checkIn) / 3600000).toFixed(1)
    );
    return duration;
  });

  const totalWorkTime = workTimeOfSession
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0)
    .toFixed(1);

  const lastWorkSessionIndex = req.staff.workSessions.length - 1;
  const lastWorkSession = req.staff.workSessions[lastWorkSessionIndex];

  const status = lastWorkSession.checkOut ? "off" : "on";

  res.render("workSession", {
    staffName: req.staff.name,
    status: status,
    totalWorkTime: totalWorkTime,
    rollCalls: workSessionToday.map((rc) => {
      const checkIn = new Date(rc.checkIn);
      const checkOut = new Date(rc.checkOut);
      return {
        checkIn: checkIn.toLocaleTimeString(),
        checkOut: checkOut.toLocaleTimeString(),
        position: rc.workPos,
      };
    }),
    pageTitle: "Today, Work Sessions",
    path: "/rollcall",
    annualLeave: req.staff.annualLeave,
    errorMessage: errorMessage[0],
  });
};

// controller to post annual leave register form
exports.postAnnualLeaveForm = (req, res, next) => {
  const leaveDuration = Number(req.body.duration);
  const leaveDates = req.body.leaveDates.split(",").map((date) => {
    return new Date(date);
  });

  const errors = validationResult(req);

  const lastWorkSessionIndex = req.staff.workSessions.length - 1;
  const lastWorkSession = req.staff.workSessions[lastWorkSessionIndex];

  const status = lastWorkSession.checkOut ? "off" : "on";

  const checkInTime = new Date(lastWorkSession.checkIn);
  const localCheckInTime = checkInTime.toLocaleTimeString();

  const checkOutTime = new Date(lastWorkSession.checkOut);
  const localCheckOutTime = checkOutTime.toLocaleTimeString();
  if (!errors.isEmpty()) {
    return res.status(422).render("rollCall", {
      pageTitle: "rollCall",
      path: "/rollcall",
      staffName: req.staff.name,
      status: status,
      checkIn: localCheckInTime,
      workPos: lastWorkSession.workPos,
      checkOut: localCheckOutTime,
      annualLeave: req.staff.annualLeave,
      errorMessage: errors.array()[0].msg,
    });
  }

  const numberOfLeaveDate = leaveDates.length;

  const leaveDateDetail = leaveDates.map((leaveDate) => {
    return {
      dayOff: leaveDate,
      reason: req.body.reasonDesc,
      duration: leaveDuration / 8,
    };
  });

  req.staff.annualLeave =
    req.staff.annualLeave - (leaveDuration * numberOfLeaveDate) / 8;

  req.staff.annualLeaveRegisters.push(...leaveDateDetail);

  req.staff
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// controller to get all the staff in for to render profile page
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

// controller to post the updated information of staff, then redirect to the profile page to see the updated infor
exports.postUpdatedProfile = (req, res, next) => {
  const image = req.file;

  if (image) {
    // delete old file that stored in server
    fileHelp.deleteFile(req.staff.imageUrl);
    // update a new url of updating file
    req.staff.imageUrl = image.path;
  }

  req.staff
    .save()
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// controller to chang  the LINES_PER_PAGE variable then the workinfor will rerender with the new value of LINES_PER_PAGE
exports.postWayToPagination = (req, res, next) => {
  const numberOfWorkSession = req.body.numberOfWorkSession;
  LINES_PER_PAGE = Number(numberOfWorkSession);
  req.session.numberOfPage = LINES_PER_PAGE;
  res.redirect("/workinfor");
};

// controller to get the information of each work session
let LINES_PER_PAGE = 5;
exports.getWorkInformation = (req, res, next) => {
  const months = req.staff.workSessions.map((workSession) => {
    return workSession.checkIn.getMonth() + 1;
  });

  const page = +req.query.page || 1;
  const startWorkSession = (page - 1) * LINES_PER_PAGE;
  const totalItems = req.staff.workSessions.length;

  // get the months of staff working time
  const workMonths = getUnique(months);
  let limitedWorkSession;
  if (LINES_PER_PAGE <= req.staff.workSessions.length - startWorkSession) {
    limitedWorkSession = req.staff.workSessions.slice(
      startWorkSession,
      startWorkSession + LINES_PER_PAGE
    );
  } else {
    limitedWorkSession = req.staff.workSessions.slice(startWorkSession);
  }

  // get working information
  const workInfors = getWorkSessionInfor(
    limitedWorkSession,
    req.staff.annualLeaveRegisters
  );

  // render the working time page with months, and working infor of each work session
  Staff.findById(req.staff.managerID)
    .then((manager) => {
      res.render("workInfor", {
        pageTitle: "Work Infor",
        path: "/workinfor",
        workInfors: workInfors,
        workMonths: workMonths,
        managerName: manager.name,
        hasNextPage: LINES_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        currentPage: page,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / LINES_PER_PAGE),
        totalWorkSession: totalItems,
        prevChoose: req.session.numberOfPage || LINES_PER_PAGE,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// const post the salary query by dedicated month , by the form in working time page
exports.postQuerySalaryMonth = (req, res, next) => {
  const chooseMonth = Number(req.body.chooseMonth);
  const chooseWorkSession = req.staff.workSessions.filter((workSession) => {
    return workSession.checkIn.getMonth() + 1 === chooseMonth;
  });

  // reuse getWorkSessionInfor function , but not on all worksessions, using it on the worksession of the pointed month
  const workInfors = getWorkSessionInfor(
    chooseWorkSession,
    req.staff.annualLeaveRegisters
  );

  const lastWorkSessionOfDay = [];

  workInfors.forEach((workInfor) => {
    if (workInfor.workTimeAndaAnnualLeave !== null) {
      if (!isNaN(workInfor.workTimeAndaAnnualLeave))
        lastWorkSessionOfDay.push(workInfor);
    }
  });

  const workTimeOfDay = lastWorkSessionOfDay.map((infor) => {
    return infor.workTimeAndaAnnualLeave;
  });

  const shortages = [];
  const overTimes = [];

  // detect the over time and shortage time of each working day

  workTimeOfDay.forEach((workTime) => {
    if (workTime > 8) {
      overTimes.push(workTime - 8);
    }
    if (workTime < 8) {
      shortages.push(8 - workTime);
    }
  });

  // get total over time of the month

  const overTimeOfMonth = overTimes.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  // get total shortage of the month

  const shortagesOfMonth = shortages.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  // calc the salary by the below function
  const salaryScale = req.staff.salaryScale;
  const salaryOfMonth =
    salaryScale * 3000000 + (overTimeOfMonth - shortagesOfMonth) * 200000;

  // use to format number to money string format,the dollar format
  let dollarUSLocale = Intl.NumberFormat("en-US");

  // render the salary query result
  res.render("salaryOfMonth", {
    pageTitle: "Detail Salary",
    path: "/workinfor",
    salaryScale: salaryScale,
    salaryOfMonth: dollarUSLocale.format(salaryOfMonth),
    shortagesOfMonth: shortagesOfMonth,
    overTimeOfMonth: overTimeOfMonth,
    chooseMonth: chooseMonth,
  });
};

// logic for not match url
exports.getErrorPage = (req, res, next) => {
  res.render("404", {
    pageTitle: "index",
    path: "/",
  });
};
