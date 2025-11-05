const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register",
    [
        body("username").not().isEmpty().withMessage("Username is required"),   
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("vehicleDetails.color").not().isEmpty().withMessage("Vehicle color is required"),
        body("vehicleDetails.model").not().isEmpty().withMessage("Vehicle model is required"),
        body("vehicleDetails.licensePlate").not().isEmpty().withMessage("License plate is required"),
        body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
        body("vehicletype").isIn(['car', 'bike', 'auto']).withMessage("Vehicle type must be one of 'car', 'bike', or 'auto'"),
    ],
    captainController.registerCaptain
);

router.post("/login",
  [
    body("email").isEmail().withMessage("valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("password must be of 6 characters"),
  ],
  captainController.loginCaptain
);

router.get("/profile",authMiddleware.authenticateCaptain ,captainController.getCaptainProfile);
router.get("/logout",authMiddleware.authenticateCaptain ,captainController.logoutCaptain);

module.exports = router;