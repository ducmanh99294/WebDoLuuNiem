const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
});

const Chat = mongoose.model('Chats', chatSchema);   
module.exports = Chat;