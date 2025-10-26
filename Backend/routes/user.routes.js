const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const usercontroller = require("../controllers/user.controller")
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register",
  [
    body('username').notEmpty().withMessage('username is required'),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }).withMessage("password must be of 6 characters"),
  ],
  usercontroller.registerUser
);

router.post("/login",
  [
    body("email").isEmail().withMessage("valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("password must be of 6 characters"),
  ],
  usercontroller.loginUser
);

router.get("/profile",authMiddleware.authenticateUser ,usercontroller.getUserProfile);
router.get("/logout",authMiddleware.authenticateUser ,usercontroller.logoutUser);

module.exports = router;