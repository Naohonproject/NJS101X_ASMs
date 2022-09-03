const { validationResult } = require("express-validator");
const Staff = require("../model/staffModel");

/**Logic for MH4 */

/**
 * Get Covid Page
 * get /covid
 * */

exports.getCovidInforForms = (req, res, next) => {
  Staff.find({ managerID: req.staff._id })
    .then((staffs) => {
      res.render("covid/covid", {
        pageTitle: "Covid Infor",
        path: "/covid",
        errorMessage: null,
        staffs: staffs,
      });
    })
    .catch((error) => {
      console.log(erro);
    });
};

// POST /covid/tempInfor

exports.postTempInfor = (req, res, next) => {
  const newTemInfor = {
    temp: Number(req.body.temp),
    time: new Date(req.body.registerTime),
  };

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("covid/covid", {
      pageTitle: "Covid Infor",
      path: "/covid",
      errorMessage: error.array()[0].msg,
    });
  }

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
        staffName: req.staff.name,
      });
    })
    .catch((error) => console.log(error));
};

exports.getTempInfor = (req, res, next) => {
  const tempRegisterDetails = req.staff.tempInfor
    .map((tempInfor) => {
      return {
        date: tempInfor.time.toLocaleDateString(),
        time: tempInfor.time.toLocaleTimeString(),
        temp: tempInfor.temp,
      };
    })
    .reverse();

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

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("covid/covid", {
      pageTitle: "Covid Infor",
      path: "/covid",
      errorMessage: error.array()[0].msg,
    });
  }

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

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("covid/covid", {
      pageTitle: "Covid Infor",
      path: "/covid",
      errorMessage: error.array()[0].msg,
    });
  }

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

// post query covid infor of staff

exports.postStaffCovidInfor = (req, res, next) => {
  Staff.findById(req.body.staffId)
    .then((staff) => {
      const tempRegisterDetails = staff.tempInfor
        .map((tempInfor) => {
          return {
            date: tempInfor.time.toLocaleDateString(),
            time: tempInfor.time.toLocaleTimeString(),
            temp: tempInfor.temp,
          };
        })
        .reverse();
      res.render("covid/tempCheckList", {
        pageTitle: "Staff Temperature Check List ",
        path: "/covid",
        tempRegisterDetails: tempRegisterDetails,
        staffName: staff.name,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postStaffQueryStaffInjectionInfor = (req, res, next) => {
  Staff.findById(req.body.staffId)
    .then((staff) => {
      res.render("covid/vaccinationInfor", {
        pageTitle: "Staff injected vaccination List ",
        path: "/covid",
        injectionInfors: staff.vaccinationInfor,
        staffName: staff.name,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
