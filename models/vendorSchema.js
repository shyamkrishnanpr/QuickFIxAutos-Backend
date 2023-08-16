import mongoose from "mongoose";
const Schema = mongoose.Schema

const vendorSchema = new Schema({
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
            centerName:{
                type:String
            },
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

const VendorModel = mongoose.model("vendor",vendorSchema)
export default VendorModel