import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true,
    },
     verifyotp:{
        type:String,
        default:''
    },
     veriftyotpexpat:{
        type:Number,
        default:0
    },
     isverified:{
        type:Boolean,
        default:false
    },
    resetotp:{
        type:String,
        default:''
    },
    resetoptexpat:{
        type:Number,
        default:0
    }

})

const userModel=mongoose.models.user || mongoose.model('user',userSchema,'users')
//This line ensures that you don’t redefine a model if it already exists 
// mongoose.models.user
// This checks if a model named "user" already exists in Mongoose’s internal cache.

// mongoose.models is an object that stores all the models Mongoose has already created.

export default userModel;