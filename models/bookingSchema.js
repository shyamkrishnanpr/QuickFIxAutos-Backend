import mongoose from "mongoose";

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    serviceId:{
        type:mongoose.Types.ObjectId,
        ref:"services"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    vendorId:{
        type:mongoose.Types.ObjectId,
        ref:"vendor"
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
    },
    paymentStatus:{
        type:String
    },
    status:{
        type:String,
        enum:['booked','cancelled','completed'],
        default:"booked"
    },

},{timestamps: true})

const BookingModel = mongoose.model("booking",bookingSchema)
export default BookingModel