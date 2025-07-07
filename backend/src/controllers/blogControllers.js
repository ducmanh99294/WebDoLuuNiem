const Blog = require('../models/Blog');
const logger = require('../utils/logger');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()

        logger.info(`Retrieved ${blogs.length} blogs`);
        res.status(200).json({
            success: true,
            message: 'Blogs retrieved successfully',
            data: blogs
        });
    } catch (e) {
        logger.error(`Error retrieving blogs: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const getBlogById = async (req,res) => {
    try {
        const blog = req.params.id;
        const blogData = await Blog.findById(blog);
        if (!blogData) {
            logger.warn(`Blog not found with ID: ${blog}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog retrieved successfully: ${blogData._id}`);
        res.status(200).json({
            success: true,
            data: blogData
        });
    } catch (e) {
        logger.error(`Error retrieving blog: ${e.message}`)
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
 }

 const createBlog = async (req, res) => {
    try {
        const {title, content, image, description} = req.body;
        if (!title || !content || !image || !description) {
            logger.warn('Title, content, and image are required to create a blog');
            res.status(404).json({
                success: false,
                message: 'Please provide title, content, and image'
            });
        }

        const newBlog = await Blog.create({ title, content, image, description });
        logger.info(`Blog created successfully: ${newBlog._id}`);
        res.status(200).json({
            success: true,
            message: 'Blog created successfully',
            data: newBlog
        });
    } catch (e) {
        logger.error(`Error creating blog: ${e.message}`);
        res.status(404).json({
            successL: false,
            message: e.message
        });
    }
}

const updateBlog = async (req, res) => {
    try {
        const blog = req.params.id
        const { title, content, image } = req.body;
        if (!title || !content || !image || !description) {
            logger.warn('Title, content, and image are required to update a blog');
            return res.status(400).json({
                success: false,
                message: 'Please provide title, content, and image'
            });
        }

        const updateBlog = await Blog.findByIdAndUpdate(blog, { title, content, image, description }, { new: true });
        if (!updateBlog) {
            logger.warn(`Blog not found with ID: ${blog}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog updating successfully: ${updateBlog.id}`);
        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updateBlog
        })
    } catch (e) {
        logger.warm(`Error updating blog: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const deleteBlog = async (req,res) => {
    try {
        const blog = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blog);
        if (!deletedBlog) {
            logger.warn(`Blog not found with ID: ${blog}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog deleted successfully: ${deletedBlog._id}`);
        res.status(200).json({
            succes: true,
            message: 'Blog deleted successfully',
            data: deletedBlog
        });
    } catch (e) {
        logger.error(`Error deleting blog: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};