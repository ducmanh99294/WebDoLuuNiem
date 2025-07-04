const mongoose = require('mongoose')

const AboutUsSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
})

const AboutUs = mongoose.model('AboutUs', AboutUsSchema)
module.exports = AboutUs;