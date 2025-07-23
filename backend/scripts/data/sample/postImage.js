const mongoose = require('mongoose');
require('dotenv').config();
const data = require('../json/images.json'); // Đường dẫn tới file JSON chứa dữ liệu ảnh
// Kết nối tới MongoDB
const url = process.env.MONGODB_URL || 'mongodb+srv://nguyenhuuhoang711:nguyenhuuhoang711@cluster0.1ya4y.mongodb.net/WebDoLuuNiem?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Định nghĩa Schema tương tự bạn đã có
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    price: Number,
    discount: { type: Number, default: 0, min: 0, max: 100 },
    Coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupons', default: null },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Images' }],
    quantity: Number,
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
    like_count: { type: Number, default: 0 },
    view_count: { type: Number, default: 0 },
    sell_count: { type: Number, default: 0 },
}, {
      timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
});

const Image = mongoose.model('Images', imageSchema);
module.exports = Image;

const Product = mongoose.model('Product', productSchema);

async function seedProducts() {
  const result = {}; // Lưu ObjectId ảnh
  try {
    for (const key in data) {
      const item = data[key];
      const imageUrls = item.url;

      // B2: Insert từng image vào DB
      const insertedImages = await Promise.all(
        imageUrls.map(url => new Image({ image: url }).save())
      );

      // B3: Lưu array _id theo thứ tự
      const imageIds = insertedImages.map(img => img._id);
      result[key] = imageIds;

      // B4: Update Product
      await Product.updateOne(
        { _id: item.product_id },
        { $set: { images: imageIds } }
      );
    }

    console.log("✅ All products seeded successfully");
} catch (err) {
    console.error(err);
  }
}

seedProducts();