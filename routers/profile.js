const express = require("express");

const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// router of the profile page,read and edit
router.get("/profile", isAuth, staffController.getStaffProfile);
router.post("/update-profile", isAuth, staffController.postUpdatedProfile);

module.exports = router;
