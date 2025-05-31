const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        })

        if(mongoose.connection) {
            console.log("Connect DB thanh cong")
        }
    } catch (error) {
        console.error(`Loi khi connect DB: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectDB