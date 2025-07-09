const Event = require('../models/Event');
const ApplicableProducts = require('../models/ApplicableProduct')
const logger = require('../utils/logger');

const createEvent = async (req, res) => {
    try {
        const { name, description, startDate, endDate, location, discount, images, products } = req.body;

        if (!name || !description || !startDate || !endDate || !location) {
            logger.error('All fields are required');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const event = new Event({
            name,
            description,
            startDate,
            endDate,
            location,
            discount,
            images,
            products
        });

        await event.save();

        logger.info(`Event created successfully with ID: ${event._id}`);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        logger.error(`Error creating event: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('images', 'url')
             .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    select: 'name price' 
                }
            });

        logger.info(`Retrieved ${events.length} events`);
        res.status(200).json({
            success: true,
            message: 'Retrieved all events successfully',
            data: events
        });
    } catch (error) {
        logger.error(`Error retrieving events: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve events',
            error: error.message
        });
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('images', 'url')
            .populate('products', 'name price');

        if (!event) {
            logger.warn(`Event not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        logger.info(`Retrieved event with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Retrieved event successfully',
            data: event
        });
    } catch (error) {
        logger.error(`Error retrieving event: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve event',
            error: error.message
        });
    }
}

const updateEvent = async (req, res) => {
    try {
        const { name, description, startDate, endDate, location, discount, images, products } = req.body;

        const event = await Event.findByIdAndUpdate(req.params.id, {
            name,
            description,
            startDate,
            endDate,
            location,
            discount,
            images,
            products
        }, { new: true });

        if (!event) {
            logger.warn(`Event not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        logger.info(`Event updated successfully with ID: ${event._id}`);
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        logger.error(`Error updating event: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            logger.warn(`Event not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        logger.info(`Event deleted successfully with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        logger.error(`Error deleting event: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
}

const addProductToEvent = async (req, res) => {
    const { productId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            logger.warn(`Event not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        console.log("id "+Array.isArray(productId), productId);
        if (!Array.isArray(productId)) {
            logger.warn(`Product already exists in event with ID: ${req.params.id}`);
            return res.status(400).json({
                success: false,
                message: 'Product already exists in this event'
            });
        }

        let addProducts = [];

        for(const id of productId) {
            if (!event.products.includes(id)) {
                event.products.push(id);
                addProducts.push(id);
            }
        }

        await event.save();
        logger.info(`Product added to event successfully with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Product added to event successfully',
            data: event
        });
} catch (error) {
    logger.error(`Error adding product to event: ${error.message}`);
    res.status(500).json({
        success: false,
        message: 'Failed to add product to event',
        error: error.message
    });
}
}

const removeProductFromEvent = async (req, res) => {
    const { productId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            logger.warn(`Event not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        console.log("id "+ !Array.isArray(productId), productId);
        if (Array.isArray(productId)) {
            logger.warn(`Product not found in event with ID: ${req.params.id}`);
            return res.status(400).json({
                success: false,
                message: 'Product not found in this event'
            });
        }

        event.products = event.products.filter(id => !productId.includes(id.toString()));
        await event.save();
        logger.info(`Product removed from event successfully with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Product removed from event successfully',
            data: event
        });
    } catch (error) {
        logger.error(`Error removing product from event: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from event',
            error: error.message
        });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    addProductToEvent,
    removeProductFromEvent
};
