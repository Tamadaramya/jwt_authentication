import jwt from "jsonwebtoken";

export const userauth=async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return res.json({success:false,message:"not authorized login again"})

    }
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        //the decoded token will be stored
        if(tokenDecode.id){
            req.userId=tokenDecode.id
        }else{
            return res.json({success:false,message:"not authorized login again"})

        }
        next();
    }catch(error){
        return res.json({success:false,message:error.message})

    }
}