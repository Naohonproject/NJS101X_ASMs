const express = require("express");
const staffController = require("../controllers/staffControllers");

const router = express.Router();

// router to get covid page
router.get("/covid", staffController.getCovidInforForms);

// routers to conform the forms int covid page
router.post("/covid/tempInfor", staffController.postTempInfor);

router.get("/covid/tempInfor", staffController.getTempInfor);

router.post("/covid/injection", staffController.postStaffInjectionInfor);

router.get("/covid/injection", staffController.getStaffInjectionInfor);

router.post(
  "/covid/covid19-positive",
  staffController.postCovid19PositiveInfor
);

router.get("/covid/covid19-positive", staffController.getCovid19PositiveInfor);

module.exports = router;
