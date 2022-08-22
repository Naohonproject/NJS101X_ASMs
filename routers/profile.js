const express = require("express");

const staffController = require("../controllers/staff");

const router = express.Router();

router.get("/profile", staffController.getStaffProfile);

module.exports = router;
