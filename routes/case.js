const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Case = require("../models/Case");
const { body, validationResult } = require("express-validator");

router.get("/fetchcases", fetchuser, async (req, res) => {
  const cases = await Case.find({ user: req.user.id });
  res.json(cases);
});

router.get("/fetchcases/open", fetchuser, async(req,res)=>{
  const cases = await Case.find({user : req.user.id, status:"Open"});
  res.json(cases);
})

router.get("/fetchcases/lawyer",fetchuser,async(req,res)=>{
    const cases = await Case.find({});
    res.json(cases);
});

router.post(
  "/newcase",
  fetchuser,
  [
    body("category").isLength({ min: 3 }),
    body("description").isLength({ min: 6 }),
    body("contactway").isLength({min:3}),
    body("contact").isLength({min:3})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const status = "Open";
    try {
      const cases = await Case.create({
        user: req.user.id,
        description: req.body.description,
        category: req.body.category,
        status:status,
        contactway:req.body.contactway,
        contact : req.body.contact
      });
      res.send(cases);
    } catch (error) {
      res.status(500).json({ error: "Error found" });
    }
  }
);

router.put('/closecase/:id',fetchuser,async (req,res)=>{
  try{
      let cases = await Case.findById(req.params.id);
      if(!cases){
          return res.status(404).json({error:"Case not found"});
      }
      if(cases.user.toString()!== req.user.id){
          return res.status(401).send("Not allowed");
      }
      cases = await Case.findByIdAndUpdate(req.params.id,{status:"Closed"});
      res.json({success:"Case closed successfully"});
  }catch(error){
      res.json({error:error.message});
  }
});

module.exports = router;