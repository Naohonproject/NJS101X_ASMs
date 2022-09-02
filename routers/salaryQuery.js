const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// post /salry-month
router.post("/salary-month", isAuth, staffController.postQuerySalaryMonth);

module.exports = router;
