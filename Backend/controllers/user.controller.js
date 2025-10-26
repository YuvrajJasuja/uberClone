const userModel = require("../models/user");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");


module.exports.registerUser = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }
    const { username,email,password } = req.body;
    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.creatUser({
        username,
        email,
        password: hashPassword
    });
    const token =  user.generateAuthToken();
    res.status(201).json({ user,token });
}

module.exports.loginUser = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }

    const { email,password } = req.body;
    //user exists or not 
    const user = await userModel.findOne({ email }).select("+password");
    if(!user){
        return res.status(400).json({ message: "invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({ message: "invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.cookie("token",token);

res.status(200).json({ token,user });
}

module.exports.getUserProfile = async(req,res,next) => {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
}

module.exports.logoutUser = async(req,res,next) => {
    res.clearCookie("token");
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;
    
    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: "Logged out successfully" });
}