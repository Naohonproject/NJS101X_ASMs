const express = require("express");
const staffController = require("../controllers/staff");

const router = express.Router();

router.get("/", staffController.getStaffCheckInForm);

router.post("/checkin", staffController.postStaffCheckIn);

router.post("/check-out", staffController.postStaffCheckout);

router.get("/infor", staffController.getStaffRollCallInfor);

module.exports = router;
