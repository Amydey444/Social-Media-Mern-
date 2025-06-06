const jwt=require('jsonwebtoken')
const HttpError=require('../models/errorModel')


const authMiddleware=async(req, res, next)=>{
    const Authorization=req.headers.Authorization || req.headers.authorization;
    console.log("🛡️ Authorization header:", Authorization);

    if(Authorization && Authorization.startsWith("Bearer")){
        const token=Authorization.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,info)=>{
            if(err){
                console.log("❌ JWT verification failed:", err.message);
                return next(new HttpError("Unauthorised.Invalid token",403))
            }

            console.log("✅ Authenticated user:", info);
            req.user=info;
            next()
        })
    } else {
        return next(new HttpError("Unauthorised. No token",401))
    }

}



module.exports=authMiddleware;