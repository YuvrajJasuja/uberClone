const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },  
    isAvailable: {
        type: Boolean,
        default: false, },
    vehicleDetails: {
        color: { type: String, required: true },
        model: { type: String, required: true },
        licensePlate: { type: String, required: true, unique: true },
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },

   vehicletype: {
        type: String,
        enum: ['car', 'bike', 'auto'],  
        required: true,
    },
    location: {
        lat: {
            type: String, },
        lon: {
            type: String, }
    }})

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id},process.env.JWT_SECRET,{expiresIn:'1d'}
    )
    return token;
}
captainSchema.methods.comparePassword = async function(password)
    {
        return await bcrypt.compare(password,this.password);
    }
captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

module.exports = mongoose.model('Captain', captainSchema);

    
