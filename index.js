const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const app = express()
app.use(express.json()); //middleware for getting data from req.body

app.use("/user",userRouter);
app.use("/course", courseRouter);
app.use("/admin",adminRouter)


async function main()
{
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(3000, ()=>{
        console.log("server ruinning at port 3000");
    });
}

main();

//15:09_2