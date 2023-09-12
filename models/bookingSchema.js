import mongoose from "mongoose";

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    serviceId:{
        type:mongoose.Types.ObjectId,
        ref:"services"
    },
    selectedDate:{
        type:Date
    },
    selectedTimeSlot:{
        type:String
    },
    selectedAddress:{
        type:String
    },
    paymentMethod:{
        type:String
    }

})

const BookingModel = mongoose.model("booking",bookingSchema)
export default BookingModel