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