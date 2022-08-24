const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.post("/salary-month", staffController.postQuerySalaryMonth);

module.exports = router;
