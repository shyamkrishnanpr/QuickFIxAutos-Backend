import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema for Users
const MessageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversations',
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'vendor',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    vendorbody: {
        type: String,
        // required: true,
    },
    userbody:{
        type:String,
    },
    date: {
        type: String,
        default: Date.now,
    },
});

export const Message = mongoose.model('messages', MessageSchema);