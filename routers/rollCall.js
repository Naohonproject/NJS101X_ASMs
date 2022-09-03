const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth, isStaff } = require("../middleware/auth");

const router = express.Router();

// router of the roll call page
router.get("/", isAuth, isStaff, staffController.getStaffRollCallForm);

router.post("/checkin", isAuth, isStaff, staffController.postStaffCheckIn);

router.post("/checkout", isAuth, isStaff, staffController.postStaffCheckout);

router.get("/infor", isAuth, isStaff, staffController.getStaffRollCallInfor);

module.exports = router;
