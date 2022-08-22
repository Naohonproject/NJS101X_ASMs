const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.get("/", staffController.getStaffRollCallForm);

router.post("/checkin", staffController.postStaffCheckIn);

router.post("/checkout", staffController.postStaffCheckout);

router.get("/infor", staffController.getStaffRollCallInfor);

module.exports = router;
