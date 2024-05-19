const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("firstname").isLength({ min: 3 }),
    body("lastname").isLength({ min: 3 }),
    body("usertype").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let success = false;
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
        .status(400)
        .json({ success, error: "This email already exists." });
      }
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
      const secpassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: secpassword,
        email: req.body.email,
        usertype: req.body.usertype,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const jwtToken = jwt.sign(data, process.env.JWT_SEC_CODE);
      success = true;
      res.json({ success, jwtToken , usertype:req.body.usertype});
    } catch (error) {
      res.status(500).json("Some error occurred");
    }
  }
);

router.post(
  "/",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
      let success = false;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtToken = jwt.sign(data, process.env.JWT_SEC_CODE);
      success = true;
      return res.json({ success, jwtToken , usertype:user.usertype});
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Some error occurred");
    }
  }
);

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

module.exports = router;
