
const { Router } = require('express')
const userRouter = Router();


userRouter.post("/signup",(req,res)=>{
    res.json({
        message: "signed up successfully"
    })
})

userRouter.post("/signin",(req,res)=>{
    res.json({
        message:"Signin endpoint"
    })
})

userRouter.get("/purchases",(req,res)=>{
    res.json({
        message:"pourchases endpoint"
    })
})

module.exports = {
    userRouter :userRouter
} 