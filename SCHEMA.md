
This course selling application have a common schema as every other application

USER: This user schema looks like 
{
    _id: ObjectId,
    email: String,
    password: String,
    firstName: String,
    lastName:String
}

ADMIN: This admin schema look like 
{
    _id: Object,
    email: String,
    password: String,
    firstName: String,
    lastName: String
}

CouseSchema: This is how my courseSchema should look like
{
    _id:Object,
    title: Strig,
    description: String,
    price: Number,
    imageUrl: String,
    createrId: Object
}

PurchasesSchema: This is how should my purchases Schema look like
{
    _id:Object ,
    courseId: Object,
    userId: Object 
}