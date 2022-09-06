const { validationResult } = require("express-validator");
const Staff = require("../model/staffModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

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
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
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
        employee: updatedStaff,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
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
    employee: req.staff,
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
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
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
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
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
        employee: staff,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.postStaffQueryStaffInjectionInfor = (req, res, next) => {
  Staff.findById(req.body.staffId)
    .then((staff) => {
      res.render("covid/vaccinationInfor", {
        pageTitle: "Staff injected vaccination List ",
        path: "/covid",
        injectionInfors: staff.vaccinationInfor,
        employee: staff,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.postQueryPositiveInfor = (req, res, next) => {
  Staff.findById(req.body.staffId)
    .then((staff) => {
      res.render("covid/covidPositiveInfor", {
        pageTitle: "Positive Covid Infor",
        path: "/covid",
        covidInfors: staff.positiveCovid,
        employee: staff,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// make pdf then send it along the response to let client download the pdf file
exports.getPDFtempInfor = (req, res, next) => {
  const employeeID = req.params.employeeId;

  Staff.findById(employeeID)
    .then((employee) => {
      if (!employee) {
        return next(new Error("The Employee was not found"));
      }
      const temPDFName = Date.now() + employeeID + ".pdf";
      const tempInforPath = path.join("data", "Staff_Temp_Infor", temPDFName);
      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + temPDFName + '"'
      );

      // pdfDoc.pipe(fs.createWriteStream(tempInforPath));

      pdfDoc.pipe(res);

      pdfDoc.fontSize(30).text("Staff Temperature Information");
      pdfDoc.fontSize(20).text(`Employee Name : ${employee.name}`);

      pdfDoc.text(
        "************************************************************"
      );

      employee.tempInfor.forEach((tempInfor) => {
        pdfDoc
          .fontSize(15)
          .text(`Date : ${tempInfor.time.toLocaleDateString()}`);
        pdfDoc
          .fontSize(15)
          .text(`Time : ${tempInfor.time.toLocaleTimeString()}`);
        pdfDoc.fontSize(15).text(`Temperature : ${tempInfor.temp}`);
        if (tempInfor.length > 1) {
          pdfDoc.text("-----------------------");
        }
      });
      pdfDoc.end();
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.getPDFVaccinationInfor = (req, res, next) => {
  const employeeID = req.params.employeeId;

  Staff.findById(employeeID)
    .then((employee) => {
      if (!employee) {
        return next(new Error("The Employee was not found"));
      }
      const temPDFName = Date.now() + employeeID + ".pdf";
      // const tempInforPath = path.join("data", "Staff_Temp_Infor", temPDFName);
      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + temPDFName + '"'
      );

      // pdfDoc.pipe(fs.createWriteStream(tempInforPath));

      pdfDoc.pipe(res);

      pdfDoc.fontSize(30).text("Staff Vaccination Information");
      pdfDoc.fontSize(20).text(`Employee Name : ${employee.name}`);

      pdfDoc.text(
        "************************************************************"
      );

      employee.vaccinationInfor.forEach((vaccineInfor) => {
        pdfDoc
          .fontSize(15)
          .text(`Date : ${vaccineInfor.injectionDate.toLocaleDateString()}`);
        pdfDoc
          .fontSize(15)
          .text(`Vaccine Type : ${vaccineInfor.vaccinationType}`);
        pdfDoc
          .fontSize(15)
          .text(`Dose of vaccine  : ${vaccineInfor.injectionOrder}`);
        if (vaccineInfor.length > 1) {
          pdfDoc.text("-----------------------");
        }
      });
      pdfDoc.end();
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.getPDFPositiveCovidInfor = (req, res, next) => {
  const employeeID = req.params.employeeId;

  Staff.findById(employeeID)
    .then((employee) => {
      if (!employee) {
        return next(new Error("The Employee was not found"));
      }
      const temPDFName = Date.now() + "positive-covid" + employeeID + ".pdf";
      // const tempInforPath = path.join("data", "Staff_Temp_Infor", temPDFName);
      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + temPDFName + '"'
      );

      // pdfDoc.pipe(fs.createWriteStream(tempInforPath));

      pdfDoc.pipe(res);

      pdfDoc.fontSize(30).text("Staff Positive Covid 19 Information");
      pdfDoc.fontSize(20).text(`Employee Name : ${employee.name}`);

      pdfDoc.text(
        "************************************************************"
      );

      employee.positiveCovid.forEach((posInfor) => {
        pdfDoc
          .fontSize(15)
          .text(`Date : ${posInfor.positiveDate.toLocaleDateString()}`);
        pdfDoc.fontSize(15).text(`Vaccine Type : ${posInfor.injectionTimes}`);
        if (posInfor.length > 1) {
          pdfDoc.text("-----------------------");
        }
      });
      pdfDoc.end();
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};
