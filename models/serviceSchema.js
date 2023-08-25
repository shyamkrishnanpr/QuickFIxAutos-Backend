import mongoose from "mongoose";
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    vendorId:{
        type:mongoose.Types.ObjectId,
        ref:'vendor'
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:'category'
    },
    subCategoryId:{
        type:mongoose.Types.ObjectId,
        ref:'subCategory'
    },
    vehicleId:{
        type:mongoose.Types.ObjectId,
        ref:'vehicles'
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    fuelOption:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const serviceModel = mongoose.model("services",serviceSchema)
export default serviceModel