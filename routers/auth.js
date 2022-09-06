const express = require("express");
const authController = require("../controllers/auth");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

// get login form
router.get("/login", authController.getLogIn);

// post login form
router.post("/login", authController.postLogIn);

// post log out form
router.post("/logout", isAuth, authController.postLogOut);

module.exports = router;
