const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;