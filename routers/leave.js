const express = require("express");
const { body } = require("express-validator");

const staffController = require("../controllers/staffControllers");
const { isAuth, isStaff } = require("../middleware/auth");

const router = express.Router();

// router for annual leave register post
// validate the annual leave form
router.post(
  "/annual-leave-register",
  isAuth,
  isStaff,
  [
    body("leaveDates")
      .exists({ checkFalsy: true })
      .withMessage("Date need to be choose"),
    body("reasonDesc")
      .exists({ checkFalsy: true })
      .withMessage("Need to describe the reason"),
    body("duration")
      .exists({ checkFalsy: true })
      .withMessage("Need to enter annual leave time"),
  ],
  staffController.postAnnualLeaveForm
);

module.exports = router;
