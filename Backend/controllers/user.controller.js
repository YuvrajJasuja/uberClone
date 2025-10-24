const userModel = require("../models/user");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");


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
    res.status(201).json( token,user)
}