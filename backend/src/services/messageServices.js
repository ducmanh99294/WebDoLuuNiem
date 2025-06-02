const Message = require('../models/Message'); // Adjust path as needed

// Create a new message
async function createMessage(data) {
    const message = new Message(data);
    return await message.save();
}

// Get messages by session ID
async function getMessagesBySession(sessionId) {
    return await Message.find({ session_id: sessionId }).sort({ timestamp: 1 });
}

// Get a single message by ID
async function getMessageById(id) {
    return await Message.findById(id);
}

// Mark a message as read
async function markMessageAsRead(id) {
    return await Message.findByIdAndUpdate(id, { is_read: true }, { new: true });
}

// Delete a message by ID
async function deleteMessage(id) {
    return await Message.findByIdAndDelete(id);
}

// Update message content
async function updateMessage(id, content) {
    return await Message.findByIdAndUpdate(id, { content }, { new: true });
}

module.exports = {
    createMessage,
    getMessagesBySession,
    getMessageById,
    markMessageAsRead,
    deleteMessage,
    updateMessage,
};