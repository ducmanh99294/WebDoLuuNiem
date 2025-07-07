const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    }
})

const Contact = mongoose.model( 'Contact', ContactSchema);
module.exports = Contact;