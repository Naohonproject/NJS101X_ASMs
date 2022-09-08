const Staff = require("../model/staffModel");
const { getWorkSessionInfor, getUnique } = require("../utils/subFunc");

exports.getManagePage = (req, res, next) => {
  const errorMessage = req.flash("error")[0];

  Staff.find({ managerID: req.staff._id })
    .then((staffs) => {
      res.render("manager/workingTimeQuery", {
        pageTitle: "Work Time Manage",
        path: "/manage",
        staffs: staffs,
        employee: null,
        message: errorMessage,
        chooseMonth: null,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.postManageStaffWorkingTime = (req, res, next) => {
  const employeeId = req.body.staffId;
  const chooseMonth = req.body.month;
  let status = true;

  // manager manages the confirm of staff's working time in the array of object, contain month and staff's _id
  req.staff.confirm.forEach((conf) => {
    if (
      conf.StaffId.toString() === employeeId &&
      conf.ConfirmMonth == chooseMonth
    ) {
      status = false;
    }
  });

  let managedEmployees;

  // find staff who is managed by this  manager
  Staff.find({ managerID: req.staff._id })
    .then((staffs) => {
      managedEmployees = staffs;
      return Staff.findById(employeeId);
    })
    .then((employee) => {
      // get working information
      const months = employee.workSessions.map((workSession) => {
        return workSession.checkIn.getMonth() + 1;
      });

      // get the unique month from months(be able to contains data like [10,10,10,9,9])
      const workMonths = getUnique(months);

      // check the month user choose whether in the work month , that user has been working
      const isChooseMonthExist = workMonths.includes(Number(chooseMonth));

      // if chooseMonth is not the month that staff have work, render the workingTimeQuery again with error message to display for user
      if (!isChooseMonthExist) {
        return res.render("manager/workingTimeQuery", {
          pageTitle: "Work Time Manage",
          path: "/manage",
          staffs: managedEmployees,
          employee: null,
          workInfors: null,
          message: "This staff have no work session in this month",
          chooseMonth: chooseMonth,
          status: status,
        });
      }
      // get all work session of this staff
      const workInfors = getWorkSessionInfor(
        employee.workSessions,
        employee.annualLeaveRegisters
      );

      // filter staff's work session to get data just in this month, not all working session
      const workInforOfChooseMonth = workInfors.filter((workinfor) => {
        const workMonth = new Date(workinfor.date).getMonth() + 1;
        return workMonth === Number(chooseMonth);
      });

      // find the invalid workinfor of month

      const errorIndex = [];

      workInforOfChooseMonth.forEach((workInfor, index) => {
        const checkIn = new Date(workInfor.workSession.checkIn);
        const checkOut = new Date(workInfor.workSession.checkOut);
        // this will check the work session that has check in day and check out day in the same day, push the index error work session to errorIndex
        if (checkIn.getDate() !== checkOut.getDate()) {
          errorIndex.push(index);
        }
      });

      res.render("manager/workingTimeQuery", {
        pageTitle: "Work Time Manage",
        path: "/manage",
        staffs: managedEmployees,
        employee: employee,
        workInfors: workInforOfChooseMonth,
        message: null,
        chooseMonth: chooseMonth,
        status: status,
        errorIndex: errorIndex,
      });
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

// let manager delete the staff's work session that is finished(has checkout)
exports.postDeleteWorkSession = (req, res, next) => {
  const DeleteWorkSessionId = req.body.workSessionId;
  const StaffId = req.body.employeeId;

  Staff.findById(StaffId)
    .then((staff) => {
      const updatedWorkSessions = staff.workSessions.filter((workSession) => {
        return workSession._id.toString() !== DeleteWorkSessionId;
      });
      staff.workSessions = updatedWorkSessions;
      return staff.save();
    })
    .then((updatedStaff) => {
      res.redirect("/manage");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};

exports.postConfirmWorkSessions = (req, res, next) => {
  const employeeId = req.body.employeeId;
  const ChooseMonth = req.body.chooseMonth;

  Staff.findById(employeeId)
    .then((employee) => {
      const workSessionOfMonth = employee.workSessions.filter((workSession) => {
        return workSession.checkIn.getMonth() + 1 == ChooseMonth;
      });
      const isNotCheckOut =
        !workSessionOfMonth[workSessionOfMonth.length - 1].checkOut;

      if (isNotCheckOut) {
        req.flash(
          "error",
          "There is an work session is not checked out yet,Please let employee checkout and try again"
        );
        return res.redirect("/manage");
      }

      req.staff.confirm.push({
        StaffId: employeeId,
        ConfirmMonth: ChooseMonth,
      });
      return req.staff.save();
    })
    .then(() => {
      req.flash(
        "error",
        "You have recently confirmed work session of this month"
      );
      return res.redirect("/manage");
    })
    .catch((err) => {
      const cachedError = new Error(err);
      cachedError.httpStatusCode = 500;
      return next(cachedError);
    });
};
