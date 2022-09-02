const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// router of the roll call page
router.get("/", isAuth, staffController.getStaffRollCallForm);

router.post("/checkin", isAuth, staffController.postStaffCheckIn);

router.post("/checkout", isAuth, staffController.postStaffCheckout);

router.get("/infor", isAuth, staffController.getStaffRollCallInfor);

module.exports = router;
