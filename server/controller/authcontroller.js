// //in this file we define differnt controllers functions like register login logout verify passwordreset
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import userModel from '../models/usermodel.js';
// import transporter from '../config/nodemailer.js';

// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.json({ success: false, message: 'Missing Details' });
//     }

//     try {
//         console.log("🔍 Registering user:", { name, email });

//         const userexist = await userModel.findOne({ email });
//         if (userexist) {
//             return res.json({ success: false, message: "User already existed" });
//         }

//         const hashedpassword = await bcrypt.hash(password, 10);
//         const user = new userModel({ name, email, password: hashedpassword });
//         await user.save();

//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });
//         //sending welcome email
//         const mailOptions={
//             from:process.env.SENDER_EMAIL,
//             to:email,
//             subject:"weclome to jwtauth",
//             text:`thank you for creating your account in jwt auth with email ${email}`
//         }
//         const info = await transporter.sendMail(mailOptions);
//         console.log('✅ Email sent:', info.response);
//         console.log("mail sent");
//         return res.json({ success: true });
//     } catch (error) {
//         console.error("❌ Register error:", error);  // <- This is the key line
//         return res.json({ success: false, message: error.message });
//     }
// };

// export const login=async(req,res)=>{
//     const {email,password} =req.body;
//     if(!email || !password){
//         return res.json({success:false,message:"enter all credentials"});
//     }
//     try{
//         const user=await userModel.findOne({email});
//         if(!user){
//             return res.json({success:false,message:'invalid email'})
//         }
//         const isMatch=await bcrypt.compare(password,user.password)
//         if(!isMatch){
//             return res.json({success:false,message:'invalid password'})
//         }
//         //user exits and authorized so create token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d',});
//         res.cookie('token',token,{
//             httpOnly:true,
//             secure:process.env.NODE_ENV==='production',
//             sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
//             maxAge:7*24*60*60*1000 //7days in milli sec
//         })
//         return res.json({success:true});

//     }catch(error){
//         return res.json({success:false,message:error.message})
//     }
// }

// export const logout = async(req,res)=>{
//     try{
//         //clear the cookie with the name of cokkie
//         res.clearCookie('token',{
//             httpOnly:true,
//             secure:process.env.NODE_ENV==='production',
//             sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
//         })
//         return res.json({success:true,message:"logged out"})
//     }catch(error){
//         return res.json({success:false,message:error.message})
//     }
// }

// export const sendVerifyOtp=async(req,res)=>{
//     try{
//         const userId=req.userId;
//         //this userid is not given bt the user we take this from cookie and that userid added in req body using function(middelware)
//         //in server middleware=>userauth.js
//         const user = await userModel.findById(userId);
//         const email = user.email;
//         if(user.isverified){
//             return res.json({success:false,message:"account already verified"})
//         }
//         const otp= String(Math.floor(100000+Math.random()*900000))
//         user.verifyotp=otp;
//         user.verifyotpexpat=Date.now()+24*60*60*1000;
//         await user.save();

//         const mailOptions={
//             from:process.env.SENDER_EMAIL,
//             to:email,
//             subject:"account verification",
//             text:`${otp}`
//         }
//         const info = await transporter.sendMail(mailOptions);
//         console.log(" Email sent sucessfully:", info.response);
//         console.log(otp);
//         console.log(email)
//         return res.json({success:true,message:"otp sent successfully"})
    
//     }catch(error){
//         res.json({success:true,message:error.message})
//     }
// }
// //verify the email using otp
// export const verifyEmail=async(req,res)=>{
//     const {otp}=req.body;
//     console.log(otp)
//     const userId=req.userId;
//     if(!userId||!otp){
//         return res.json({success:false,message:'missing data'});
//     }
//     try{
//         const user =await userModel.findById(userId);
//         if(!user){
//             return res.json({success:false,message:"user not found"})

//         }
//         if(!user.verifyotp||user.verifyotp!==otp){
//             return res.json({success:false,message:"invalid otp"})
//         }
//         if(user.verifyOtpExpireAt<Date.now()){
//             return res.json({success:false,message:"expired"})

//         }
//         user.isverified=true;
//         user.verifyOtpExpireAt=0;
//         user.verifyOtp='';
//         await user.save();
//         return res.json({success:true,message:"email verified success"})

//     }catch(error){
//         return res.json({success:false,message:error.message})
//     }
// }
// //check user is authenticated
// //if the token is created then it is authenticated that is checked in userauth middelware
// export const isAuthenticated=async (req,res)=>{
//     try{
//         return res.json({success:true})
//     }catch(error){
//         res.json({success:false,message:error.message})
//     }
// }

// //send password reset otp
// export const sendResetOtp=async(req,res)=>{
//     const {email}=req.body;
//     if(!email){
//         return res.json({success:true,message:"email is required"})
//     }
//     try{
//         const user=await userModel.findOne({email});
//         if(!user){
//             return res.json({success:false,message:"user not found"})
//         }
//         const otp= String(Math.floor(100000+Math.random()*900000))
//         user.resetOtp=otp;
//         //15 min
//         user.resetOtpExpireAt=Date.now()+15*60*1000;
//         await user.save();

//         const mailOptions={
//             from:process.env.SENDER_EMAIL,
//             to:email,
//             subject:"reset your otp",
//             text:`${otp} this otp is valid upto 15min from now`
//         }
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Reset OTP sent:", info.response);
//         console.log(otp);
//         return res.json({success:true,message:"otp sent successfully"})

//     }catch(error){
//         return res.json({success:false,message:error.message})
//     }
// }

// export const resetPassword=async(req,res)=>{
//     const {otp,email,newpassword}=req.body;
    
//     if(!otp||!email||!newpassword){
//         return res.json({success:false,message:"enter all credentials"});
    
//     }
//     try {
//         const user= await userModel.findOne({email});
//         if(!user){
//             return res.json({success:false,message:"user not found"})
//         }
//         if(user.resetotp!==otp||user.resetotp===''){
//             return res.json({success:false,message:"invalid otp"})
//         }
//         if(user.resetotpExpireAt<Date.now()){
//             return res.json({success:false,message:"otp expired"})
//         }
//         const hashedpassword=await bcrypt.hash(newpassword,10)
//         user.password=hashedpassword;
//         user.resetotp='';
//         user.restOtpExpireAt=0;
//         await user.save();
//         return res.json({success:true,message:"Your password has been successfully reset. Please log in with your new password."})
//     } catch (error) {
//         return res.json({success:false,message:error.message})
//     }
        
    
// }   


//in this file we define differnt controllers functions like register login logout verify passwordreset
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        console.log("🔍 Registering user:", { name, email });

        const userexist = await userModel.findOne({ email });
        if (userexist) {
            return res.json({ success: false, message: "User already existed" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedpassword });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        //sending welcome email
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"weclome to jwtauth",
            text:`thank you for creating your account in jwt auth with email ${email}`
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        console.log("mail sent");
        return res.json({ success: true });
    } catch (error) {
        console.error("❌ Register error:", error);  // <- This is the key line
        return res.json({ success: false, message: error.message });
    }
};

export const login=async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.json({success:false,message:"enter all credentials"});
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:'invalid email'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:'invalid password'})
        }
        //user exits and authorized so create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d',});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000 //7days in milli sec
        })
        return res.json({success:true});

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const logout = async(req,res)=>{
    try{
        //clear the cookie with the name of cokkie
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
        })
        return res.json({success:true,message:"logged out"})
    }catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const sendVerifyOtp=async(req,res)=>{
    try{
        const userId=req.userId;
        //this userid is not given bt the user we take this from cookie and that userid added in req body using function(middelware)
        //in server middleware=>userauth.js
        const user = await userModel.findById(userId);
        const email = user.email;
        if(user.isverified){
            return res.json({success:false,message:"account already verified"})
        }
        const otp= String(Math.floor(100000+Math.random()*900000))
        user.verifyotp=otp;
        user.veriftyotpexpat=Date.now()+24*60*60*1000;
        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"account verification",
            text:`${otp}`
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(" Email sent sucessfully:", info.response);
        console.log(otp);
        console.log(email)
        return res.json({success:true,message:"otp sent successfully"})
    
    }catch(error){
        res.json({success:true,message:error.message})
    }
}
//verify the email using otp
export const verifyEmail=async(req,res)=>{
    const {otp}=req.body;
    console.log(otp)
    const userId=req.userId;
    if(!userId||!otp){
        return res.json({success:false,message:'missing data'});
    }
    try{
        const user =await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found"})

        }
        if(!user.verifyotp||user.verifyotp!==otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.veriftyotpexpat<Date.now()){
            return res.json({success:false,message:"expired"})

        }
        user.isverified=true;
        user.veriftyotpexpat=0;
        user.verifyotp='';
        await user.save();
        return res.json({success:true,message:"email verified success"})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}
//check user is authenticated
//if the token is created then it is authenticated that is checked in userauth middelware
export const isAuthenticated=async (req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

//send password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:true,message:"email is required"})
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        const otp= String(Math.floor(100000+Math.random()*900000))
        user.resetotp=otp;
        //15 min
        user.resetoptexpat=Date.now()+15*60*1000;
        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"reset your otp",
            text:`${otp} this otp is valid upto 15min from now`
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Reset OTP sent:", info.response);
        console.log(otp);
        return res.json({success:true,message:"otp sent successfully"})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const resetPassword=async(req,res)=>{
    const {otp,email,newpassword}=req.body;
    
    if(!otp||!email||!newpassword){
        return res.json({success:false,message:"enter all credentials"});
    
    }
    try {
        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        if(user.resetotp!==otp||user.resetotp===''){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.resetoptexpat<Date.now()){
            return res.json({success:false,message:"otp expired"})
        }
        const hashedpassword=await bcrypt.hash(newpassword,10)
        user.password=hashedpassword;
        user.resetotp='';
        user.resetoptexpat=0;
        await user.save();
        return res.json({success:true,message:"Your password has been successfully reset. Please log in with your new password."})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
        
    
}
