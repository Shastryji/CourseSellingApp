
const { Router } = require('express')
const userRouter = Router();
const zod  = require('zod');
const { userModel } = require('../db/db.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const env = require('dotenv')


const signInSchema = zod.object({
    email: zod.string().email().min(5, "email length should be grater than 5"),
    password: zod.string(), //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), "must contain 8 characters and 1 letter and 1 number"), ///constain 8 characters 1 letter and 1 number
    firstName: zod.string().min(3, "must have length grater than 3"),
    lastName: zod.string().min(3, "must have length grater than 3"),
})  


userRouter.post("/signup",async (req,res)=>{
    try
  {
    signInSchema.parse(req.body); //adding some zod validations
    const {email,password,firstName,lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password,salt);
    await userModel.create({email,password:hashedPassword,firstName,lastName});

    // Send the success response here
    return res.json({
      message: "signed up successfully"
    });

  } catch(error)
  {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ errors: error.errors });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
})

userRouter.post("/signin",async (req,res)=>{
  try{
      const {email,password} = req.body;
      const userLogData = await userModel.findOne({"email":email,})
      if(!email)
      {
        res.status(401).json({
          message: "Invalid credentials"
        })
      }
      const ifPasswordMatch = await bcrypt.compare(password,userLogData.password);
      if(ifPasswordMatch)
      {
        const token = await jwt.sign(email,process.env.JWT_SECRET); 
      res.status(200).json({
        message: "user loggedin successfully",
        _id: userLogData._id,
        token:token
      })
      }
      else{
        res.status(401).json({
          message: "Password doesn't match"
        })
      }
  }catch(error)
  {
    console.log(error);
    res.status(500).json({
      message:"Internal Server Error",
      error:error
    })
  }
})

userRouter.get("/purchases",(req,res)=>{
    res.json({
        message:"pourchases endpoint"
    })
})

module.exports = {
    userRouter :userRouter
} 