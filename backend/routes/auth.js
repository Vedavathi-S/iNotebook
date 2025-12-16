const express=require('express');
const User=require("../models/User");
const {body,validationResult } = require('express-validator');
const router=express.Router();

router.post('/',[
    body('name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:5}),
], async (req,res)=>{
     const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
try {
      // Create user
      const user = new User(req.body);
      await user.save();

      // Send response
      res.status(201).json({
        success: true,
        message: "User created successfully"
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

module.exports=router;