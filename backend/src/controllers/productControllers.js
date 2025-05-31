const Product = require('../models/Product.js');
const Image = require('../models/Image.js');
const Category = require('../models/Category.js');

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('images').populate('categories');
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            products: products
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message 
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('images').populate('categories');
        if (!product) {
            return res.status(500).json({
                success: false,
                message: 'Sản phẩm không tồn tại'
            });
        } 

        res.json(product);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {new: true}
        );  

        if (!product) return res.status(404).json({
            success: false,
            message: 'Sản phẩm không tồn tại'
        });

        res.json(product);
    } catch (e) {  
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(404).json({
            success: false,
            message: 'Sản phẩm không tồn tại'
        });

        res.json({product});
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};