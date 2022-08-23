const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.get("/workinfor", staffController.getWorkInformation);

module.exports = router;
