const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

// post /salry-month
router.post("/salary-month", staffController.postQuerySalaryMonth);

module.exports = router;
