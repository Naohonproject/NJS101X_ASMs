const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

// get /workinfor reqest, then getWorkInformation will control the res
router.get("/workinfor", staffController.getWorkInformation);

module.exports = router;
