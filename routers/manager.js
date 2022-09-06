const express = require("express");
const managerController = require("../controllers/managerController");

const { isAuth } = require("../middleware/auth");

const router = express.Router();

// get manage page
router.get("/manage", isAuth, managerController.getManagePage);

// post request from manager to see work session of staff
router.post("/manage", isAuth, managerController.postManageStaffWorkingTime);

// post delete staff work session
router.post(
  "/manage/deleteWorkSession",
  isAuth,
  managerController.postDeleteWorkSession
);

// post Confirm monthly work session of staff
router.post(
  "/manage/confirm-Work-Session",
  isAuth,
  managerController.postConfirmWorkSessions
);

module.exports = router;
