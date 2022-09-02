const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// get /workinfor reqest, then getWorkInformation will control the res
router.get("/workinfor", isAuth, staffController.getWorkInformation);

module.exports = router;
