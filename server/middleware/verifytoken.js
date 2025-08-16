import jwt from "jsonwebtoken";

export const verifytoken=(req,res,next)=>{
    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;  //Express automatically lowercases all header keys.
    if(authHeader&&authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];//index 0 is bearer and 1 contains the the token we provided in authentication header

        if(!token){
           return res.status(401).json({message:"no token"});
        }
        try{
            const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);
            req.user = tokenDecode
            console.log(tokenDecode);
            next();

        }catch(err){
            res.status(400).json({message:"token not valid"});
        }
    }else{
         return res.status(401).json({message:"no token"});
    }
}