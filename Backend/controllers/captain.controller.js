const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");


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
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
}

module.exports.logoutCaptain = async(req,res,next) => {
    res.clearCookie("token");
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;
    
    await blacklistTokenModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}