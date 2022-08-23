const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.post("/annual-leave-register", staffController.postAnnualLeaveForm);

module.exports = router;
