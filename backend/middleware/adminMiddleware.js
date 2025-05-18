const jwt = require('jsonwebtoken');
require('dotenv').config();

function adminMiddleware(req,res,next)
{
    const token = req.cookies.sessionId;
    if(!token)
    {
        return res.status(401).json({
            message: "Authentication required"
        })
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET_ADMIN);
        req.adminId = decode.adminId; 
        req.sessionId = decode.sessionId;
        next();
    }catch(error)
    {
        console.log('Error veryfying token for admin')
        res.status(401).json({ message: "invalid session"});
    }

}


module.exports = {adminMiddleware};