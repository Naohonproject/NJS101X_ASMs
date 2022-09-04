const Staff = require("../model/staffModel");
const { getWorkSessionInfor, getUnique } = require("../utils/subFunc");

exports.getManagePage = (req, res, next) => {
  Staff.find({ managerID: req.staff._id })
    .then((staffs) => {
      res.render("manager/workingTimeQuery", {
        pageTitle: "Work Time Manage",
        path: "/manage",
        staffs: staffs,
        employee: null,
        message: null,
        chooseMonth: null,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postManageStaffWorkingTime = (req, res, next) => {
  const employeeId = req.body.staffId;
  const chooseMonth = req.body.month;

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

      res.render("manager/workingTimeQuery", {
        pageTitle: "Work Time Manage",
        path: "/manage",
        staffs: managedEmployees,
        employee: employee,
        workInfors: workInforOfChooseMonth,
        message: null,
        chooseMonth: chooseMonth,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
