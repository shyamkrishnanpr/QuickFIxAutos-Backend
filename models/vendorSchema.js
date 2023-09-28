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
    centerName:{
        type:String
    },
    latitude:{
      type:Number
    },
    longitude:{
        type:Number
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'vendor'], 
        default: 'vendor', 
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
    ],
    availability:[
        {
            date:String,
            slots:[]
        }
    ]


},{timestamps: true})

const VendorModel = mongoose.model("vendor",vendorSchema)
export default VendorModel