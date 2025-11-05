const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }

    const { username, email, password, vehicleDetails, capacity, vehicletype } = req.body;

    const isExistingCaptain = await captainModel.findOne({ email });
    if(isExistingCaptain){
        return  res.status(400).json({ message: "Captain with this email already exists" });
    }

    const hashPassword = await captainModel.hashPassword(password);
    const Captain = await captainService.createCaptain({
        username,
        email,
        password: hashPassword,
        vehicleDetails: {
            color: vehicleDetails.color,
            model: vehicleDetails.model,
            licensePlate: vehicleDetails.licensePlate
        },
        capacity,
        vehicletype
    });
    const token = Captain.generateAuthToken();
    res.status(201).json({ Captain,token });
}

module.exports.loginCaptain = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }

    const { email,password } = req.body;
    //user exists or not 
    const captain = await captainModel.findOne({ email }).select("+password");
    if(!captain){
        return res.status(400).json({ message: "invalid credentials" });
    }

    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({ message: "invalid credentials" });
    }

    const token = captain.generateAuthToken();
    res.cookie("token",token);

res.status(200).json({ token,captain });
}

module.exports.getCaptainProfile = async(req,res,next) => {
    // authenticateCaptain middleware sets `req.captain`.
    const captain = req.captain;
    if (!captain) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // return the captain object (password is excluded by schema `select: false`)
    res.status(200).json({ captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
    res.clearCookie("token");
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (token) {
        await blacklistTokenModel.create({ token });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
``};