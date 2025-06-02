const mongoose = require('mongoose');

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
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

supportSessionSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'closed' && !this.closed_at) {
    this.closed_at = new Date();
  }
  next();
});


const SupportSession = mongoose.model('SupportSession', supportSessionSchema);
module.exports = SupportSession;