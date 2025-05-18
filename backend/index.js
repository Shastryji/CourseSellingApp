const express = require('express');
const cookieParser = require("cookie-parser");
const {v2:cloudinary} = require("cloudinary");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const app = express()

app.use(cors({origin: 'http://localhost:5173'}) ) //added the cors for connecting the backend to frontend 
app.use(express.json()); //middleware for getting data from req.body
app.use(cookieParser());
app.use("/user",userRouter);
app.use("/course", courseRouter);
app.use("/admin",adminRouter)


//let's authenticate cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


async function main()
{
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(3000, ()=>{
        console.log("server ruinning at port 3000");
    });
}

main();

//50:48_2