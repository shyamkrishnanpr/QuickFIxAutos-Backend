import mongoose from "mongoose";
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    brand:{
        type:String
    },
    model:{
        type:String
    },
    image:{
        type:String
    }
})

const VehicleModel = mongoose.model("vehicles",vehicleSchema)
export default VehicleModel;