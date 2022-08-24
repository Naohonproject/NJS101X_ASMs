const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

router.get("/covid", staffController.getCovidInforForms);

router.post("/covid/tempInfor", staffController.postTempInfor);

router.post("/covid/injection", staffController.postStaffInjectionInfor);

router.post(
  "/covid/covid19-positive",
  staffController.postCovid19PositiveInfor
);

module.exports = router;
