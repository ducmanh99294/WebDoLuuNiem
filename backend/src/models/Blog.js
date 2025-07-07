const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
        type: String,
        required: true,
    }]
}, {
    timestamps: true,
    versionKey: false
});

const Blog = mongoose.model('Blog', BlogSchema, 'blogs');
module.exports = Blog;