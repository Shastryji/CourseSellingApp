const { Router } = require("express");
const { courseModel } = require("../db/db");

const courseRouter = Router();

courseRouter.get("/preview",async (req,res)=>{
    try{const allCourseDetails = await courseModel.find({})
    res.json({
        message:"course preview endpoint",
        courses : allCourseDetails
    })}
    catch(error)
    {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = {
    courseRouter: courseRouter
}