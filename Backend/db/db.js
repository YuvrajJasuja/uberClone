const mongoose = require("mongoose");

function connect(){
mongoose.connect("mongodb://127.0.0.1:27017/UBERDatabase")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
}
  module.exports = connect;