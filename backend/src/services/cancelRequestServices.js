const CancelRequest = require('../models/CancelRequest'); // Adjust path if needed

// 1. Get all cancel requests
async function getAll() {
    return await CancelRequest.find().populate('user_id').populate('order_id');
}

// 2. Get cancel request by ID
async function getById(id) {
    return await CancelRequest.findById(id).populate('user_id').populate('order_id');
}

// 3. Accept cancel request (approve)
async function acceptCancerRequest(id) {
    return await CancelRequest.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
    );
}

// 4. Reject cancel request
async function rejectCancerRequest(id) {
    return await CancelRequest.findByIdAndUpdate(
        id,
        { status: 'rejected' },
        { new: true }
    );
}

// 5. Create a new cancel request
async function createCancerRequest(data) {
    const cancelRequest = new CancelRequest(data);
    return await cancelRequest.save();
}

module.exports = {
    getAll,
    getById,
    acceptCancerRequest,
    rejectCancerRequest,
    createCancerRequest
};