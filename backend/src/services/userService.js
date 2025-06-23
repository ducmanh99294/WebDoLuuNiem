const User = require('../models/User');

const getAllUsers = async () => {
    return await User.find().select('-password'); 
};

const getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

const createUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

const updateUser = async (id, userData) => {
    if (userData.password) delete userData.password;

    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

const updateInfo = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};