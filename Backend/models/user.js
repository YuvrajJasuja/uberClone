const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, //it will hide password when user.find() is called
  },
  socketId:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign(
    {_id: this._id},process.env.JWT_SECRET
  );
  return token;
};

userSchema.methods.comparePassword = async function(enterPassword){
  return await bcrypt.compare(enterPassword,this.password);
}

userSchema.statics.hashPassword = async function(enterPassword){
  return await bcrypt.hash(enterPassword,10);
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
