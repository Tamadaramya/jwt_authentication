import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB= async() =>{
    mongoose.connection.on('connected',()=>console.log("connected"))
    //()=>console.log("connected") is a callback function.
    //It doesn't run immediately when the code is read.
    //It will only run when Mongoose emits the 'connected' event, which happens when the connection is successfully established.
    await mongoose.connect(`${process.env.MONGODB_URI}/jwtauth`);
    //Connect to MongoDB  
    //Using a connection string from an environment variable 
    //And specifically connect to the jwt_auth database
};

export default connectDB;