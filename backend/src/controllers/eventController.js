const Event = require('../models/Event');
const ApplicableProduct = require('../models/ApplicableProduct')
const Image = require("../models/Image")
const logger = require('../utils/logger');
const { getReviewById } = require('./reviewController');

const createEvent = async (req, res) => {
    try {
        const { name, description, startDate, endDate, discount, images, location } = req.body;

        if (!name || !description || !startDate || !endDate ) {
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
    // KHÔNG dùng .lean() trước populate lồng
    const events = await Event.find()
       .populate({
        path: 'products',
        populate: {
          path: 'productId',
          model: 'Products',
          populate: {
            path: 'images', 
            model: 'Images', 
          },
        },
      });
console.log('👉 Kết quả populate:', JSON.stringify(events, null, 2));
    const applications = await ApplicableProduct.find({
      eventId: { $ne: null },
    });

    // Gom nhóm theo eventId
    const eventProductMap = {};
    applications.forEach((app) => {
      const id = app.eventId.toString();
      if (!eventProductMap[id]) eventProductMap[id] = [];
      eventProductMap[id].push(app.productId);
    });

    // Thêm field `appliedProductCount` cho mỗi event
    const enrichedEvents = events.map((event) => {
      const appliedProducts = eventProductMap[event._id.toString()] || [];
      return {
        ...event.toObject(), // chuyển từ Document sang plain Object để thêm field mới
        appliedProductCount: appliedProducts.length,
      };
    });

    res.status(200).json({ success: true, data: enrichedEvents });
  } catch (err) {
    console.error("❌ Error when getting events:", err);
    res.status(500).json({ success: false, message: "Failed to get events" });
  }
};


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
  try {
    const eventId = req.params.id;
    const { products, discount, startDate, endDate } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có sản phẩm nào được chọn' });
    }

    const createdApplicableProducts = [];

    for (const productId of products) {
              console.log('🟡 Thêm sản phẩm vào event:', {
                eventId,
                products,
                discount,
                startDate,
                endDate
                });
      const applicable = await ApplicableProduct.create({
        eventId,
        productId,
        discount,
        startDate,
        endDate,
      });



      // Cập nhật sự kiện
      await Event.findByIdAndUpdate(eventId, {
        $push: { products: applicable._id },
      });

      createdApplicableProducts.push(applicable);
    }

    return res.status(200).json({
      success: true,
      message: 'Đã thêm sản phẩm vào sự kiện',
      data: createdApplicableProducts,
    });
  } catch (err) {
    console.error('❌ Lỗi khi thêm sản phẩm vào sự kiện:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

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
    getReviewById,
    updateEvent,
    deleteEvent,
    addProductToEvent,
    removeProductFromEvent
};
