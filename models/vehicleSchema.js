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
    },

    vehicleImages:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }

        }
    ],
})

const VehicleModel = mongoose.model("vehicles",vehicleSchema)
export default VehicleModel;