const bcrypt  = require("bcryptjs") // for encryption
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const userSchema = new Schema({
    email: {type: String, unique: true, require:true},
    password: {type:String, unique:true, require:true},
    firstName: {type:String, require:true},
    lastName: {type:String, require:true}
})

const adminSchema = new Schema({
    email: {type:String, unique:true, require:true},
    password: {type:String, unique:true, require:true},
    firstName: {type:String, require:true},
    lastName: {type:String, require:true}
})

const courseSchema = new Schema({
    title: {type:String, require:true},
    description: {type:String, require:true},
    price: {require:true, type:Number},
    imageUrl: {type:String},
    createrId: {type:ObjectId}
})

const purchasesSchema = new  Schema({
    courseId: {type: ObjectId, ref: 'course'}, //use course references for this to make it better
    userId: {type: ObjectId, ref: 'user'} //use user references for this to make it better
})


// to encrypt the password  this is the advance method to encrypt password fileds
// userSchema.pre('save', async (next)=>{
//     if(!this.isModified('password'))
//     {
//         return next();
//     }
//     try{
//         const salt = await bcrypt.genSalt(10); //saltgen
//         const hashedPassword = await bcrypt.hash(this.password, salt)
//         this.password = hashedPassword
//         nect();
//     }
//     catch(error)
//     {
//         next(error);
//     }
// })

// adminSchema.pre('save', async (next)=>{
//     if(!this.isModified('password'))
//     {
//         return next();
//     }
//     try{
//         const salt = await bcrypt.genSalt(10); //saltgen
//         const hashedPassword = await bcrypt.hash(this.password, salt) //hashed
//         this.password = hashedPassword
//         next();
//     }
//     catch(error)
//     {
//         next(error);
//     }
// })

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchasesSchema);

module.exports = {
    userModel: userModel,
    adminModel: adminModel,
    courseModel: courseModel,
    purchaseModel: purchaseModel
}