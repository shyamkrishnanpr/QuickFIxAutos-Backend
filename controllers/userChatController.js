import { Conversation } from "../models/conversation.js";
import { Message } from "../models/messages.js";
import mongoose from "mongoose";



const privateChat = async (req, res) => {
    try {
        let vendorId = req.params.vendorId;
        let userId = req.params.userId;
        console.log(vendorId)
        console.log("body",req.body);
        let vendorid = mongoose.Types.ObjectId.createFromHexString(vendorId);
        let userid = mongoose.Types.ObjectId.createFromHexString(userId);
        

        // Find or create the conversation between the sender and the recipient
        const conversation = await Conversation.findOneAndUpdate(
            {
                $and: [{ vendorId: vendorid }, { userId: userid }],
            },   
            {
                vendorId: vendorid,
                userId: userid,
                lastMessage: req.body.data,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        // Create a new message
        const message = new Message({
            conversation: conversation._id,
            vendorId: vendorid,
            userId: userid,
            userbody: req.body.data,
        });

        // Save the message
        await message.save();

        // Emit the message to clients using websockets (assuming you're using Socket.io)

        // Send the success response with conversationId
        
        res.end(
            JSON.stringify({
                message: 'Success',
                recieverId:vendorid,
                chat:req.body.data,
                date:conversation.date,
                conversationId: conversation._id,
            })
        );
    } catch (err) {
        console.error(err);
        
        res.status(500).end(JSON.stringify({ message: 'Failure' }));
    }
};


const getChatConversation = async (req, res) => {
    try {
        let vendorId = req.params.vendorId;
        let userId = req.params.userId;
        let conversationId = req.params.conversationId;
        console.log(vendorId,"at");
        let vendor = new mongoose.Types.ObjectId(vendorId);
        let user = new mongoose.Types.ObjectId(userId);
        // console.log(vendor);
        const messages = await Message.aggregate([
            {
                $lookup: {
                    from: 'vendor',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
            {
                $match: {
                    
                         $and: [{ vendorId: vendor }, { userId: user }] ,
                       
                    
                },
            },
            {
                $project: {
                    _id: 0,
                    conversation:1,
                    userbody: 1,
                    vendorbody: 1,
                    date:1
                },
            },
        ]).exec();

        // console.log(messages);
        res.json(messages); // Send messages as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failure' }); // Send error response with status code 500
    }
};






export {privateChat,getChatConversation}