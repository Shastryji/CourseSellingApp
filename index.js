const express = require('express')
const app = express()

app.post("user/signup",(req,res)=>{
    res.json({
        message:"User signed up successfully"
    })
})
