import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema for Users
const ConversationSchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'vendor',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    lastMessage: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Conversation = mongoose.model('conversations', ConversationSchema);