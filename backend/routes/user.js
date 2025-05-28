const {v4:uuidv4} = require('uuid')
const { Router } = require('express')
const userRouter = Router();
const zod  = require('zod');
const { userModel, purchaseModel, courseModel } = require('../db/db.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { default: signInSchema } = require('../middleware/schemaZod.js');
const { userMiddleware } = require('../middleware/userMiddleware.js');
require('dotenv').config() 


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
        const sessionID = uuidv4(); //generating user sessionid
        
        const token = jwt.sign({"userId":userLogData._id, sessionId: sessionID },process.env.JWT_SECRET_USER,{
          expiresIn: Math.floor(process.env.SESSION_DURATION_USER/1000), //SESSION DURATION IN SECONDS
        }); 
        
        res.cookie('sessionId', token, {
          httpOnly: true,
          maxAge: process.env.SESSION_DURATION_USER,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'Strict',
          path: '/'
        })

        res.status(200).json({
          message: "user login successfull",
          token: token
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
      message:"User Not found Please check email/password",
      error:error
    })
  }
})

userRouter.post("/purchases",userMiddleware,async (req,res)=>{
  const userId = req.userId;
  const courseId = req.body.courseId;

  await purchaseModel.create({
    userId: userId,
    courseId: courseId
  })
  
    res.json({
        message:"course purchased successfully"
    })
})

userRouter.get("/purchases",userMiddleware, async(req,res)=>{
  
  try
  {
    const userId = req.userId;
    const purchasedCourses = await courseModel.find({userId});
    res.ststus(200).json({
      message: "these are the purchased courses",
      purchasedCourses
    })
  }catch(error)
  {
    res.status(500).json({
      message: "error in purchasing courses"
    })
  }
})

userRouter.get("/preview",async (req,res)=>{
  const courseDetails = await courseModel.find({});

    res.json({
        message:"see all created courses",
        courseDetails
    })
})    

userRouter.get('/logout',userMiddleware, async (req,res)=>{
  try {
		res.cookie("sessionId", " ", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
})

module.exports = {
    userRouter :userRouter
} 