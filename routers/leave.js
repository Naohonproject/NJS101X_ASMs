const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

// router for annual leave register post
router.post("/annual-leave-register", staffController.postAnnualLeaveForm);

module.exports = router;
