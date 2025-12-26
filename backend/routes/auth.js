const express=require('express');
const User=require("../models/User");
const {body,validationResult } = require('express-validator');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchUser=require('../middlewares/fetchUser');


const JWT_SECRET=process.env.JWT_SECRET;

//ROUTE-1 Create a user using :POST "/api/auth/createuser". No login required (SIGNUP route)
router.post('/createuser',
  //added a validator
  [
    body('name').isLength({min:3}),
    body('email').isEmail(),//it also checks unique
    body('password').isLength({min:5}),
], async (req,res)=>{
//if there are errors, return request and the errors.
     const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
try {
     const salt=await bcrypt.genSalt(10);
     const secPass= await bcrypt.hash(req.body.password,salt);

      // Create user and adds all the details from request body with User schema 
      const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
      })

      const data={
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data, JWT_SECRET);
      console.log({token});

      //await user.save();saves it in the database.
     
      // Send response
       res.json({token});

      // res.status(201).json({
      //   success: true,
      //   message: "User created successfully"
      // });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

//ROUTE-2 Aunthenticate user using POST "/api/auth/loginuser", no login required. (LOGINUSER route)
router.post('/loginuser',
  [
    body('email').isEmail(),
    body('password').exists()
  ]
  ,async (req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()});
  }
   
  const {email, password}=req.body;
  try{
  const user=await User.findOne({email});
  if(!user)
  {
   return res.status(400).json({error: "Invalid credentials"})
  }
  const passwordComp=await bcrypt.compare(password,user.password);
  if(!passwordComp)
  {
   return res.status(400).json({error: "Invalid credentials"})
  }
  const data={
    user:{
      id:user.id
    }
  }
  const token=jwt.sign(data,JWT_SECRET);
  console.log({token});
     
  // Send response
  res.json({
    success:true,
     token});
  }
  catch(err)
  {
    res.status(500).json("Internal error occured");
  }
  })

//ROUTE-3 Get logged in  user details using POST "/api/auth/loginuser",login required. (LOGINUSER route)
/*1. Client sends POST /getuser
2. Token is sent in headers
3. fetchUser verifies token
4. req.user.id is extracted
5. User fetched from DB
6. User data returned*/

router.post('/getuser',fetchUser,async (req,res)=>{
 try {
  // req.user was added by fetchUser middleware
    const userId = req.user.id;
    // Fetch user from database except password
    const user = await User.findById(userId).select("-password");
    // Sends user details to client
    res.json(user);
 }catch(err)
  {
    console.log(err.message)
    res.status(500).json("Internal error occured");
  }
});

module.exports=router;
