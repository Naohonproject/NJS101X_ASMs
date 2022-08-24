const express = require("express");

const staffController = require("../controllers/staffControllers");

const router = express.Router();

// router of the profile page,read and edit
router.get("/profile", staffController.getStaffProfile);
router.post("/update-profile", staffController.postUpdatedProfile);

module.exports = router;
