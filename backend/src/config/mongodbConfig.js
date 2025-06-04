require('dotenv').config();
const logger = require("../utils/logger");
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL || 'mongodb://admin:123456@mongodb:27018/WebDoLuuNiem';


const connectMongoDB = async () => {
    try {
        console.log(mongoURL);
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Set max pool size to 10
            minPoolSize: 1, // Set min pool size to 1
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server is not available
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error', error)
    }
}

module.exports = connectMongoDB;
