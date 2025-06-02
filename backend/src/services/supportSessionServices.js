const SupportSession = require('../models/SupportSession'); // Adjust path as needed

// Create a new support session
async function createSupportSession(data) {
    const session = new SupportSession(data);
    return await session.save();
}

// Get all support sessions
async function getAllSupportSessions(filter = {}) {
    return await SupportSession.find(filter)
        .populate('agent_id')
        .populate('customer_id')
        .exec();
}

// Get a support session by ID
async function getSupportSessionById(id) {
    return await SupportSession.findById(id)
        .populate('agent_id')
        .populate('customer_id')
        .exec();
}

// Update a support session by ID
async function updateSupportSession(id, updateData) {
    return await SupportSession.findByIdAndUpdate(id, updateData, { new: true })
        .populate('agent_id')
        .populate('customer_id')
        .exec();
}

// Delete a support session by ID
async function deleteSupportSession(id) {
    return await SupportSession.findByIdAndDelete(id).exec();
}

module.exports = {
    createSupportSession,
    getAllSupportSessions,
    getSupportSessionById,
    updateSupportSession,
    deleteSupportSession
};