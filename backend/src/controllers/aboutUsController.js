const AboutUs = require('../models/AboutUs');
const logger = require('../utils/logger');

const getAllAbout = async (req, res) => {
    try {
        const aboutUs = await AboutUs.find()

        logger.info(`Retrieved ${aboutUs.length} blogs`);
        res.status(200).json({
            success: true,
            message: 'About retrieved successfully',
            data: aboutUs
        });
    } catch (e) {
        logger.error(`Error retrieving blogs: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const getAboutById = async (req,res) => {
    try {
        const aboutUs = req.params.id;
        const aboutUsData = await AboutUs.findById(aboutUs);
        if (!aboutUsData) {
            logger.warn(`Blog not found with ID: ${aboutUs}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog retrieved successfully: ${aboutUsData._id}`);
        res.status(200).json({
            success: true,
            data: aboutUsData
        });
    } catch (e) {
        logger.error(`Error retrieving aboutUs: ${e.message}`)
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
 }

 const createAbout = async (req, res) => {
    try {
        const {image, description} = req.body;
        if (!image || !description) {
            logger.warn('description and image are required to create a about');
            res.status(404).json({
                success: false,
                message: 'Please provide description, and image'
            });
        }

        const newAbout = await AboutUs.create({ image, description });
        logger.info(`Blog created successfully: ${newAbout._id}`);
        res.status(200).json({
            success: true,
            message: 'Blog created successfully',
            data: newAbout
        });
    } catch (e) {
        logger.error(`Error creating blog: ${e.message}`);
        res.status(404).json({
            successL: false,
            message: e.message
        });
    }
}

const updateAbout = async (req, res) => {
    try {
        const about = req.params.id
        const { description, image } = req.body;
        if (!image || !description) {
            logger.warn('description and image are required to update a about');
            return res.status(400).json({
                success: false,
                message: 'Please provide description and image'
            });
        }

        const updateAbout = await AboutUs.findByIdAndUpdate(about, { title, content, image, description }, { new: true });
        if (!updateAbout) {
            logger.warn(`Blog not found with ID: ${about}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog updating successfully: ${updateAbout.id}`);
        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updateAbout
        })
    } catch (e) {
        logger.warm(`Error updating about: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const deleteAbout = async (req,res) => {
    try {
        const about = req.params.id;
        const deletedAbout = await Blog.findByIdAndDelete(about);
        if (!deletedAbout) {
            logger.warn(`Blog not found with ID: ${about}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        logger.info(`Blog deleted successfully: ${deletedAbout._id}`);
        res.status(200).json({
            succes: true,
            message: 'Blog deleted successfully',
            data: deletedAbout
        });
    } catch (e) {
        logger.error(`Error deleting about: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

module.exports = {
    getAllAbout,
    getAboutById,
    createAbout,
    updateAbout,
    deleteAbout
};