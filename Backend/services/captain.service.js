const captainModel = require("../models/captain.model");


module.exports.createCaptain = async ({
    username, email, password, vehicleDetails, capacity, vehicletype
}) => {
    if (!username || !email || !password || !vehicleDetails || !capacity || !vehicletype) {
        throw new Error("All fields are required to create a captain.");
    }
    const captain = await captainModel.create({
        username,
        email,
        password,
        vehicleDetails,
        capacity,
        vehicletype
    });
    return captain;
}
    
    