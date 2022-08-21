const express = require("express");
const staffController = require("../controllers/staff");

const router = express.Router();

router.get("/annual-leave", staffController.getAnnualLeaveForm);

module.exports = router;
