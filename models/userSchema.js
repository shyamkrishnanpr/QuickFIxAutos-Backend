import mongoose from "mongoose";
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName:{
        type:String
    }, 
    email:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    password:{
        type:String
    },
    isBlock:{
        type:Boolean,
        default:false
    },
    address:[
        {
            area:{
                type:String
            },
            city:{
                type:String
            },
            pincode:{
                type:Number
            },
            landMark:{
                type:String
            },
            state:{
                type:String
            }

        }
    ]
})

const UserModel = mongoose.model("user",userSchema)
export default UserModel