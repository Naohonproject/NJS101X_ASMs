const express = require("express");
const managerController = require("../controllers/managerController");

const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/manage", isAuth, managerController.getManagePage);

router.post("/manage", isAuth, managerController.postManageStaffWorkingTime);

router.post(
  "/manage/deleteWorkSession",
  isAuth,
  managerController.postDeleteWorkSession
);

router.post(
  "/manage/confirm-Work-Session",
  isAuth,
  managerController.postConfirmWorkSessions
);

module.exports = router;
