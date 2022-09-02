const express = require("express");
const staffController = require("../controllers/staffControllers");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// router to get covid page
router.get("/covid", isAuth, staffController.getCovidInforForms);

// routers to conform the forms int covid page
router.post("/covid/tempInfor", isAuth, staffController.postTempInfor);

router.get("/covid/tempInfor", isAuth, staffController.getTempInfor);

router.post(
  "/covid/injection",
  isAuth,
  staffController.postStaffInjectionInfor
);

router.get("/covid/injection", isAuth, staffController.getStaffInjectionInfor);

router.post(
  "/covid/covid19-positive",
  isAuth,
  staffController.postCovid19PositiveInfor
);

router.get(
  "/covid/covid19-positive",
  isAuth,
  staffController.getCovid19PositiveInfor
);

module.exports = router;
