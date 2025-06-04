const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

    user: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            parentMessageId: { 
                type: mongoose.Schema.Types.ObjectId, 
                default: null 
            }
        }
    ],
});

const Chat = mongoose.model('Chats', chatSchema);   
module.exports = Chat;