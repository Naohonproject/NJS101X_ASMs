const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// router for annual leave register post
router.post(
  "/annual-leave-register",
  isAuth,
  staffController.postAnnualLeaveForm
);

module.exports = router;
