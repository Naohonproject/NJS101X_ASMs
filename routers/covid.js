const express = require("express");
const { body } = require("express-validator");

const covidController = require("../controllers/covidController");
const { isAuth, isStaff } = require("../middleware/auth");

const router = express.Router();

// router to get covid page
router.get("/covid", isAuth, covidController.getCovidInforForms);

// routers to conform the forms int covid page
router.post(
  "/covid/tempInfor",
  isAuth,
  [
    body("registerTime")
      .exists({ checkFalsy: true })
      .withMessage("Need to add a temperature declaration date"),
    body("temp")
      .isFloat({ min: 31, max: 41 })
      .withMessage(
        " Temperature have to be not out of the temperature range that is people still alive"
      ),
  ],
  covidController.postTempInfor
);

router.get("/covid/tempInfor", isAuth, covidController.getTempInfor);

router.post(
  "/covid/injection",
  isAuth,
  body("injectionDate")
    .exists({ checkFalsy: true })
    .withMessage("Dates of injection need to set"),
  covidController.postStaffInjectionInfor
);

router.get("/covid/injection", isAuth, covidController.getStaffInjectionInfor);

router.post(
  "/covid/covid19-positive",
  isAuth,
  [
    body("positiveDate")
      .exists({ checkFalsy: true })
      .withMessage("Positive Date date need to be added"),
    body("numberOfVaccination")
      .isInt({ min: 1, max: 4 })
      .withMessage("the number if injections need to between 1 and 4"),
  ],
  covidController.postCovid19PositiveInfor
);

router.post(
  "/covid/query/temp-infor",
  isAuth,
  covidController.postStaffCovidInfor
);

router.post(
  "/covid/query/injection-infor",
  isAuth,
  covidController.postStaffQueryStaffInjectionInfor
);

router.post(
  "/covid/query/covid19-positive-infor",
  isAuth,
  covidController.postQueryPositiveInfor
);

router.get("/covid/temp-query/:employeeId", covidController.getPDFtempInfor);

router.get(
  "/covid/covid19-positive",
  isAuth,
  covidController.getCovid19PositiveInfor
);

router.get(
  "/covid/vaccination-query/:employeeId",
  covidController.getPDFVaccinationInfor
);

router.get(
  "/covid/covid-positive-query/:employeeId",
  covidController.getPDFPositiveCovidInfor
);

module.exports = router;
