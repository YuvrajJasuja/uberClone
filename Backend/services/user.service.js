const userModel = require("../models/user");


module.exports.creatUser = async({
    username,
    email,
    password

}) => {
    if(!username||!email||!password){
        throw new Error("all fields are required");
    }

const user = userModel.create({
    username,
    email,
    password
})
return user;
}