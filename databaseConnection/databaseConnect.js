require('dotenv').config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_CONNECTION_STRING;
const connectToDatabase = async () => {
  await mongoose.connect(mongoURI);
};

module.exports = connectToDatabase;
