const express = require("express");
const managerController = require("../controllers/managerController");

const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/manage", managerController.getManagePage);

router.post("/manage", managerController.postManageStaffWorkingTime);

module.exports = router;
