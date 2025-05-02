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
const { cloudinaryImageUrlGen } = require("../middleware/coudinaryImage.js");
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

  try {

    await cloudinaryImageUrlGen(imageUrl);

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

adminRouter.put("/course",adminMiddleware,async (req,res)=>{
    const adminId = req.adminId;
    const {title, description, price, courseId } = req.body;
    let imageUrl = req.body.imageUrl;
    try{
        const courseInfo = await courseModel.findOne({_id:courseId});
        await cloudinary.uploader.destroy(courseInfo.imageUrl.split("/").pop().split(".")[0]);
        imageurl = await cloudinaryImageUrlGen(imageUrl);

        await courseModel.updateOne({_id: courseId, createrId: adminId},
          {
            title: title,
            description:description,
            price: price,
            imageUrl:imageUrl
          }
         )

        res.status(201).json({
          message: "Course Updated successfully",
          couseId: courseInfo._id
        })

      }catch(error)
      {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Internal server error", details: error });
      }
})

adminRouter.get("/course/bulk",adminMiddleware, (req,res)=>{
    res.json({
        message:"get bulk courses"
    })
})

module.exports ={
    adminRouter:adminRouter
}