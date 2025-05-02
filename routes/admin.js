const {Router} =  require("express");
const {v2:cloudinary} = require("cloudinary");
const {v4:uuidv4} = require('uuid');
const adminRouter = Router();
const { adminModel, courseModel } = require("../db/db.js");
const zod = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { default:signInSchema } = require("../middleware/schemaZod.js");
const { adminMiddleware } = require("../middleware/adminMiddleware.js");
require('dotenv').config();

adminRouter.post("/signup",async (req,res)=>{
    try
      {
        //signInSchema.parse(req.body); //adding some zod validations
        const {email,password,firstName,lastName } = req.body;
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password,salt);
        await adminModel.create({email,password:hashedPassword,firstName,lastName});
    
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

adminRouter.post("/signin",async (req,res)=>{
    try{
          const {email,password} = req.body;
          const adminLogInfo = await adminModel.findOne({"email":email,})
          if(!email)
          {
            res.status(401).json({
              message: "Invalid credentials"
            })
          }
          const ifPasswordMatch = await bcrypt.compare(password,adminLogInfo.password);
          if(ifPasswordMatch)
          {
            const sessionID = uuidv4(); //generating user sessionid
            
            const token = jwt.sign({"adminId":adminLogInfo._id, sessionId: sessionID },process.env.JWT_SECRET_ADMIN,{
              expiresIn: Math.floor(process.env.SESSION_DURATION_ADMIN/1000), //SESSION DURATION IN SECONDS
            }); 
            
            res.cookie('sessionId', token, {
              httpOnly: true,
              maxAge: process.env.SESSION_DURATION_ADMIN,
              secure: process.env.NODE_ENV === "production",
              sameSite: 'Strict',
              path: '/'
            })
    
            res.status(200).json({
              message: "admin login successfull",
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
          message:"Internal Server Error",
          error:error
        })
      }
})

adminRouter.post("/course",adminMiddleware,async (req,res)=>{
  const adminId = req.adminId;
  const { title, description, price } = req.body;
  let imageUrl = req.body.imageUrl;
  console.log (adminId);

  try {
    if (imageUrl) {
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
            resource_type: "image",
          });
          imageUrl = uploadedResponse.secure_url;
        } catch (cloudinaryErr) {
          console.error("Cloudinary Upload from URL Error:", cloudinaryErr);
          return res.status(500).json({ error: "Failed to upload image from URL", details: cloudinaryErr });
        }
      } else {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(imageUrl);
          imageUrl = uploadedResponse.secure_url;
        } catch (cloudinaryErr) {
            console.error("Cloudinary Upload from base64 Error:", cloudinaryErr);
            return res.status(500).json({ error: "Failed to upload image (base64)", details: cloudinaryErr });
        }
      }
    } else {
      imageUrl = ""; 
    }


  const courseDetails = await courseModel.create({
    title: title,
    description:description,
    imageUrl:imageUrl,
    price: price,
    createrId: adminId,
  })
  res.status(201).json({ 
  message: "Course created successfully",
  course: courseDetails, 
  });
} catch (error) {
  console.error("Error creating course:", error);
  res.status(500).json({ error: "Internal server error", details: error });
}
});

adminRouter.put("/course",adminMiddleware, (req,res)=>{
    res.json({
        message:"admin put courses"
    })
})

adminRouter.get("/course/bulk",adminMiddleware, (req,res)=>{
    res.json({
        message:"get bulk courses"
    })
})

module.exports ={
    adminRouter:adminRouter
}