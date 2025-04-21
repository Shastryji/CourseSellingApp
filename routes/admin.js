const {Router} =  require("express")
const adminRouter = Router()

adminRouter.post("/signup",(req,res)=>{
    res.json({
        message:"admin signup"
    })
})

adminRouter.post("/signin",(req,res)=>{
    res.json({
        message:"admin signin"
    })
})

adminRouter.post("/course",(req,res)=>{
    res.json({
        message: "admin courses see"
    })
})

adminRouter.put("/course",(req,res)=>{
    res.json({
        message:"admin put courses"
    })
})

adminRouter.get("/course/bulk",(req,res)=>{
    res.json({
        message:"get bulk courses"
    })
})

module.exports ={
    adminRouter:adminRouter
}