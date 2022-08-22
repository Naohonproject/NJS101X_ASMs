const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.get("/covid", staffController.getCovidInforForms);

module.exports = router;
