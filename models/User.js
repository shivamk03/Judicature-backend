const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  usertype:{
    type:String,
    required:true
  },
  contact:{
    type:String
  }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
