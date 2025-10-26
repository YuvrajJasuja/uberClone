const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captain.controller");

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
module.exports = router;