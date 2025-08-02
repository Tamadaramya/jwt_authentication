import express from 'express'
import {isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail} from '../controller/authcontroller.js';
import { userauth } from '../middleware/userauth.js';

const authRouter=express.Router();
//It creates a router object using Express. This object acts like a mini version of your Express app — it can have its own routes and middleware.

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/sendverifyotp',userauth,sendVerifyOtp);
//userauth is a middelware that should be execute first since we assigned userid to req body in mw
authRouter.post('/verifyaccount',userauth,verifyEmail);
authRouter.post('/isauth',userauth,isAuthenticated);
authRouter.post('/sendresetotp',sendResetOtp);
authRouter.post('/resetpassword',resetPassword);



export default authRouter;

//for this routes cnrrollers are there in authcontrollers