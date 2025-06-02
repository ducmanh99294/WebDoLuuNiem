const mongoose = require('mongoose');
const argon2 = require('argon2')

const supportSessionSchema = new mongoose.Schema({
    closed_at: { 
        type: Date 
    },
    status: { 
        type: String, 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    agent_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
});

const SupportSession = mongoose.model('SupportSession', supportSessionSchema);
module.exports = SupportSession;