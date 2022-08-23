const express = require("express");

const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.get("/profile", staffController.getStaffProfile);
router.post("/update-profile", staffController.postUpdatedProfile);

module.exports = router;
