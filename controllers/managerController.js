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
      res.redirect("/manager/workingTimeQuery");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postConfirmWorkSessions = (req, res, next) => {
  console.log(req.body.workSession.split(","));
  // const workSessions = req.body.workSession;
  // const checkOuts = workSessions.map((workSession) => {
  //   return workSession.checkOut;
  // });

  console.log(req.body.employeeId);
  console.log(req.body.chooseMonth);
  res.redirect("/");
};
