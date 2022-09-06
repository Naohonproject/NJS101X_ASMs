const express = require("express");

const staffController = require("../controllers/staffControllers");
const { isAuth, isStaff } = require("../middleware/auth");

const router = express.Router();

// router of the profile page,read and edit
router.get("/profile", isAuth, isStaff, staffController.getStaffProfile);

// post staff update avatar
router.post(
  "/update-profile",
  isAuth,
  isStaff,
  staffController.postUpdatedProfile
);

module.exports = router;
