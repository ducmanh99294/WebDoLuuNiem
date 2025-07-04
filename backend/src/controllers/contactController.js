const Contact = require('../models/Contact');
const logger = require('../utils/logger');

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()

        logger.info(`Retrieved ${contacts.length} contacts`);
        res.status(200).json({
            success: true,
            message: 'Contacts retrieved successfully',
            data: contacts
        });
    } catch (e) {
        logger.error(`Error retrieving contacts: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const getContactById = async (req,res) => {
    try {
        const contact = req.params.id;
        const contactData = await Contact.findById(contact);
        if (!contactData) {
            logger.warn(`Contact not found with ID: ${contact}`);
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        logger.info(`Contact retrieved successfully: ${contactData._id}`);
        res.status(200).json({
            success: true,
            data: contactData
        });
    } catch (e) {
        logger.error(`Error retrieving contact: ${e.message}`)
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
 }

 const getContactByUserId = async (req,res) => {
    try {
        const {userId} = req.params;

        if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu userId'
        });
        }

        const contact = await Contact.find({user: userId});

        res.status(200).json({
        success: true,
        message: 'Lấy contact theo user thành công',
        data: orders
        });
    } catch (err) {
        console.error('err: ', err);
    }
}

 const createContact = async (req, res) => {
    try {
        const {title, email, name, phone, message, user } = req.body;
        if (!title || !email || !name || !phone || !message) {
            logger.warn('title, email, name, phone, message are required to create a contact');
            return res.status(404).json({
                success: false,
                message: 'Please provide title, email, name, phone, message'
            });
        }

        const newContact = await Contact.create({ user, title, email, name, phone, message });
        logger.info(`Contact created successfully: ${newContact._id}`);
        res.status(200).json({
            success: true,
            message: 'Contact created successfully',
            data: newContact
        });
    } catch (e) {
        logger.error(`Error creating contact: ${e.message}`);
        res.status(404).json({
            successL: false,
            message: e.message
        });
    }
}

const updateContact = async (req, res) => {
    try {
        const contact = req.params.id
        const { title, email, name, phone, message, user } = req.body;
        if (!title || !email || !name || !phone || !message) {
            logger.warn('title, email, name, phone, message are required to update a contact');
            return res.status(400).json({
                success: false,
                message: 'Please provide title, email, name, phone, message'
            });
        }

        const updateContact = await Contact.findByIdAndUpdate(contact, { user, title, email, name, phone, message }, { new: true });
        if (!updateContact) {
            logger.warn(`Contact not found with ID: ${contact}`);
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        logger.info(`Contact updating successfully: ${updateContact.id}`);
        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: updateContact
        })
    } catch (e) {
        logger.warm(`Error updating contact: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const deleteContact = async (req,res) => {
    try {
        const contact = req.params.id;
        const deletedContact = await Contact.findByIdAndDelete(contact);
        if (!deletedContact) {
            logger.warn(`Contact not found with ID: ${contact}`);
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        logger.info(`Contact deleted successfully: ${deletedContact._id}`);
        res.status(200).json({
            succes: true,
            message: 'Contact deleted successfully',
            data: deletedContact
        });
    } catch (e) {
        logger.error(`Error deleting cContact: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getContactByUserId
};