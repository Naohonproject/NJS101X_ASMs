const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth, isStaff } = require("../middleware/auth");

const router = express.Router();

// get /workinfor reqest, then getWorkInformation will control the res
router.get("/workinfor", isAuth, isStaff, staffController.getWorkInformation);

module.exports = router;
