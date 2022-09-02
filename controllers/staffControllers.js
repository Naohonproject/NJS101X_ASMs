// import the sub funcions firm utils folder
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
    });
  }
};

// controllder to post staff checkin to db, then save it , after that rerender rollcal page to update new status of staff working status
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
    .catch((error) => console.log(error));
};

// post staff checkout then render the infor of all rollcalls of this day(realtime)
exports.postStaffCheckout = (req, res, next) => {
  const lastWorkSessionIndex = req.staff.workSessions.length - 1;
  req.staff.workSessions[lastWorkSessionIndex].checkOut = Date.now();

  req.staff
    .save()
    .then(() => {
      res.redirect("/rollcall/infor");
    })
    .catch((error) => {
      console.log(error);
    });
};

// get all the rollcall of today, then render it to views
exports.getStaffRollCallInfor = (req, res, next) => {
  const workSessions = req.staff.workSessions;
  // filter from all worksession ,by using isToday function to filting the worksessions
  const workSessionToday = workSessions.filter((workSession) =>
    isToday(workSession.checkIn)
  );

  const workTimeOfSession = workSessionToday.map((workSession) => {
    const duration = Number(
      ((workSession.checkOut - workSession.checkIn) / 3600000).toFixed(2)
    );
    return duration;
  });

  const totalWorkTime = workTimeOfSession.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

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
    pageTitle: "All Work Session",
    path: "/rollcall",
    annualLeave: req.staff.annualLeave,
  });
};

// controller to post annual leave register form
exports.postAnnualLeaveForm = (req, res, next) => {
  const leaveDuration = Number(req.body.duration);
  const leaveDates = req.body.leaveDates.split(",").map((date) => {
    return new Date(date);
  });

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
    .catch((error) => console.log(error));
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

  console.log(req);

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
    .catch((error) => console.log(error));
};

// controller to get the infor mation of each worksestion
exports.getWorkInformation = (req, res, next) => {
  const months = req.staff.workSessions.map((workSession) => {
    return workSession.checkIn.getMonth() + 1;
  });

  // get the months of staff working time
  const workMonths = getUnique(months);

  // get workin infor
  const workInfors = getWorkSessionInfor(
    req.staff.workSessions,
    req.staff.annualLeaveRegisters
  );

  // render the working time page with months, and working infor of each worksession
  res.render("workInfor", {
    pageTitle: "Work Infor",
    path: "/workinfor",
    workInfors: workInfors,
    workMonths: workMonths,
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

/**Logic for MH4 */

/**
 * Get Covid Page
 * get /covid
 * */

exports.getCovidInforForms = (req, res, next) => {
  res.render("covid/covid", {
    pageTitle: "Covid Infor",
    path: "/covid",
  });
};

// POST /covid/tempInfor

exports.postTempInfor = (req, res, next) => {
  const newTemInfor = {
    temp: Number(req.body.temp),
    time: new Date(req.body.registerTime),
  };

  const douIndex = req.staff.tempInfor.findIndex((infor) => {
    return infor.time.getTime() === newTemInfor.time.getTime();
  });

  if (douIndex > -1) {
    req.staff.tempInfor[douIndex] = newTemInfor;
  } else {
    req.staff.tempInfor.push(newTemInfor);
  }

  req.staff
    .save()
    .then((updatedStaff) => {
      const tempRegisterInfors = updatedStaff.tempInfor;

      const tempRegisterDetails = tempRegisterInfors.map((tempInfor) => {
        return {
          date: tempInfor.time.toLocaleDateString(),
          time: tempInfor.time.toLocaleTimeString(),
          temp: tempInfor.temp,
        };
      });

      res.render("covid/tempCheckList", {
        pageTitle: "Staff Temperature Check List ",
        path: "/covid",
        tempRegisterDetails: tempRegisterDetails,
      });
    })
    .catch((error) => console.log(error));
};

exports.getTempInfor = (req, res, next) => {
  const tempRegisterDetails = req.staff.tempInfor.map((tempInfor) => {
    return {
      date: tempInfor.time.toLocaleDateString(),
      time: tempInfor.time.toLocaleTimeString(),
      temp: tempInfor.temp,
    };
  });

  res.render("covid/tempCheckList", {
    pageTitle: "Staff Temperature Check List ",
    path: "/covid",
    tempRegisterDetails: tempRegisterDetails,
  });
};

exports.postStaffInjectionInfor = (req, res, next) => {
  const injectionInfor = {
    injectionOrder: req.body.injectionTime,
    vaccinationType: req.body.vaccineType,
    injectionDate: req.body.injectionDate,
  };

  const douIndex = req.staff.vaccinationInfor.findIndex((infor) => {
    return infor.injectionOrder == injectionInfor.injectionOrder;
  });

  if (douIndex > -1) {
    req.staff.vaccinationInfor[douIndex] = injectionInfor;
  } else {
    req.staff.vaccinationInfor.push(injectionInfor);
  }

  req.staff
    .save()
    .then((updatedStaff) => {
      const injectionInfors = updatedStaff.vaccinationInfor;

      res.render("covid/vaccinationInfor", {
        pageTitle: "Staff injected vaccination List ",
        path: "/covid",
        injectionInfors: injectionInfors,
      });
    })
    .catch((error) => console.log(error));
};

exports.getStaffInjectionInfor = (req, res, next) => {
  res.render("covid/vaccinationInfor", {
    pageTitle: "Staff injected vaccination List ",
    path: "/covid",
    injectionInfors: req.staff.vaccinationInfor,
  });
};

exports.postCovid19PositiveInfor = (req, res, next) => {
  const covidInfor = {
    injectionTimes: req.body.numberOfVaccination,
    positiveDate: new Date(req.body.positiveDate),
  };

  const douIndex = req.staff.positiveCovid.findIndex((infor) => {
    return infor.positiveDate.getTime() === covidInfor.positiveDate.getTime();
  });

  if (douIndex > -1) {
    req.staff.positiveCovid[douIndex] = covidInfor;
  } else {
    req.staff.positiveCovid.push(covidInfor);
  }

  req.staff
    .save()
    .then((updatedStaff) => {
      const covidInfors = updatedStaff.positiveCovid;
      res.render("covid/covidPositiveInfor", {
        pageTitle: "Positive Covid Infor",
        path: "/covid",
        covidInfors: covidInfors,
      });
    })
    .catch((error) => console.log(error));
};

exports.getCovid19PositiveInfor = (req, res, next) => {
  res.render("covid/covidPositiveInfor", {
    pageTitle: "Positive Covid Infor",
    path: "/covid",
    covidInfors: req.staff.positiveCovid,
  });
};

// logic for not match url
exports.getErrorPage = (req, res, next) => {
  res.render("404", {
    pageTitle: "index",
    path: "/",
  });
};
