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
    const { title, content, description, imageLinks } = req.body;

    if (!title || !content || !description) {
      logger.warn('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and description'
      });
    }

    // Ảnh upload từ máy
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => `/uploads/blogs/${file.filename}`);
    }

    // Ảnh từ link
    let linkImages = [];
    if (imageLinks) {
      try {
        linkImages = Array.isArray(imageLinks)
          ? imageLinks
          : JSON.parse(imageLinks); // nếu là JSON string
      } catch (err) {
        logger.warn('imageLinks is not valid JSON');
      }
    }

    const allImages = [...uploadedImages, ...linkImages];

    // Tạo blog mới
    const newBlog = await Blog.create({
      title,
      content,
      description,
      image: allImages
    });

    logger.info(`✅ Blog created successfully: ${newBlog._id}`);
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (e) {
    logger.error(`❌ Error creating blog: ${e.message}`);
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

const updateBlog = async (req, res) => {
    try {
        const blog = req.params.id
        const { title, content, description } = req.body;
        if (!title || !content || !description) {
            logger.warn('Title, content, and image are required to update a blog');
            return res.status(400).json({
                success: false,
                message: 'Please provide title, content, and image'
            });
        }

            const existingEvent = await Blog.findById(req.params.id);
            if (!existingEvent) {
              logger.warn(`Event not found with ID: ${req.params.id}`);
              return res.status(404).json({ success: false, message: 'Event not found' });
            }
        
           // Ảnh từ link (chuỗi URL)
          let imageLinks = [];
          if (req.body.image) {
            if (Array.isArray(req.body.image)) {
              imageLinks = req.body.image.filter((img) => typeof img === 'string');
            } else if (typeof req.body.image === 'string') {
              imageLinks = [req.body.image];
            }
          }

          // Ảnh từ file upload
          let uploadedFiles = [];
          if (req.files && req.files.length > 0) {
            uploadedFiles = req.files.map((file) => `/uploads/blogs/${file.filename}`);
          }

          // Gộp ảnh mới (link + file)
          const newImages = [...imageLinks, ...uploadedFiles];

          // Gộp với ảnh cũ, bỏ trùng
          const finalImages = newImages.length > 0 ? newImages : existingEvent.image;
          console.log('req.files:', req.files);
          console.log('req.body.image:', req.body.image);


        const updateBlog = await Blog.findByIdAndUpdate(
            blog, 
            { 
                title, 
                content, 
                image: finalImages, 
                description 
            }, 
            { new: true });

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