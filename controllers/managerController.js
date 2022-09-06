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

  req.staff.confirm.forEach((conf) => {
    if (
      conf.StaffId.toString() === employeeId &&
      conf.ConfirmMonth == chooseMonth
    ) {
      status = false;
    }
  });

  let managedEmployees;

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

      const workMonths = getUnique(months);

      const isChooseMonthExist = workMonths.includes(Number(chooseMonth));

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

      const workInfors = getWorkSessionInfor(
        employee.workSessions,
        employee.annualLeaveRegisters
      );

      const workInforOfChooseMonth = workInfors.filter((workinfor) => {
        const workMonth = new Date(workinfor.date).getMonth() + 1;
        return workMonth === Number(chooseMonth);
      });

      // find the invalid workinfor of month

      const errorIndex = [];

      workInforOfChooseMonth.forEach((workInfor, index) => {
        const checkIn = new Date(workInfor.workSession.checkIn);
        const checkOut = new Date(workInfor.workSession.checkOut);

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
