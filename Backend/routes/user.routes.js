const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const usercontroller = require("../controllers/user.controller")

router.post("/register",
  [
    body('username').notEmpty().withMessage('username is required'),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }).withMessage("password must be of 6 characters"),
  ],
  usercontroller.registerUser
);


module.exports = router;