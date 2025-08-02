import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authroutes.js'
import userRouter from "./routes/userroutes.js";

const app=express();
const port=process.env.PORT || 4000
// if we have defined port number in environment variable that will be assigned else 4000

connectDB();
app.use(express.json());
//this middleware parses the incoming json data into request body

app.use(cookieParser())
//Adds a middleware that reads cookies from the HTTP request and makes them available as req.cookies in your app.

app.use(cors({credentials:true}))
//Enables CORS (Cross-Origin Resource Sharing) and allows cookies or credentials to be sent from a different domain (like your frontend app).

app.get('/',(req,res)=>
res.send("working")
);
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port,()=>console.log(`server started in port:${port}`));