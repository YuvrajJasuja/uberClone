const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require('../models/blacklistToken.model'); 



//user authentication hai ya nhi 
module.exports.authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }  
    const isblacklisted = await blacklistTokenModel.findOne({ token });
    if (isblacklisted) {
        return res.status(401).json({ message: "Unauthorised , Token is blacklisted. Please login again." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)
        req.user = user;
        return next();
    }catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }}
