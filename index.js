require('dotenv').config();
const connectToDatabase = require("./databaseConnection/databaseConnect.js");
const express = require("express");
const cors = require("cors");

connectToDatabase();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/case", require("./routes/case"));

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(process.env.PORT, () => {
  console.log(`MyNotesApp working on http://localhost:${process.env.PORT}`);
});
