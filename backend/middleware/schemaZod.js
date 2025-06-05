import zod from 'zod'

const signInSchema = zod.object({
    email: zod.string().email().min(5, "email length should be grater than 5"),
    password: zod.string(), //.regex(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), "must contain 8 characters and 1 letter and 1 number"), ///constain 8 characters 1 letter and 1 number
    firstName: zod.string().min(3, "must have length grater than 3"),
    lastName: zod.string().min(3, "must have length grater than 3"),
})  


export default signInSchema;