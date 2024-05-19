const mongoose = require("mongoose");
const { Schema } = mongoose;

const CaseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
  },
  category:{
    type:String,
    required:true
  },
  status: {
    type: String,
    required: true,
  },
  contactway:{
    type:String,
    required:true
  },
  contact:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("cases", CaseSchema);
