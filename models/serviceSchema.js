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
    workList:[{
        description:String,
        duration:Number,
        partsRequired:[String]

    }]
})

const serviceModel = mongoose.model("services",serviceSchema)
export default serviceModel