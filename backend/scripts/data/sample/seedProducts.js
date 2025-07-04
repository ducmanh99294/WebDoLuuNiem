const mongoose = require('mongoose');
require('dotenv').config();
// Kết nối tới MongoDB
const url = process.env.MONGODB_URL

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

const Product = mongoose.model('Product', productSchema);


const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})



const Categories = mongoose.model('Categories', categorySchema);

const CategoryImage = [
    "https://png.pngtree.com/png-clipart/20201209/original/pngtree-seafood-platter-png-image_5633430.jpg",
    "https://png.pngtree.com/png-vector/20230321/ourmid/pngtree-cool-summer-fruit-png-image_6658082.png",
    "https://png.pngtree.com/png-clipart/20230414/original/pngtree-summer-fruit-cold-drink-pattern-png-image_9057329.png",
    "https://png.pngtree.com/png-vector/20190114/ourmid/pngtree-milk-jelly-sweets-dessert-food-png-image_330700.png",
    "https://png.pngtree.com/png-vector/20240125/ourmid/pngtree-crispy-tiny-spring-rolls-png-image_11491695.png",
    "https://png.pngtree.com/png-vector/20250305/ourmid/pngtree-3d-tea-transparent-background-png-image_15727686.png",
    "https://png.pngtree.com/png-vector/20241205/ourmid/pngtree-matcha-tea-powder-bowl-png-image_14548156.png",
    "https://png.pngtree.com/png-vector/20250121/ourmid/pngtree-date-dry-food-transparent-png-image_15291522.png",
    "https://png.pngtree.com/element_pic/16/11/08/c82844da0335b2ebc80ce46bf2bf2326.png"
]

const images = [
    "68484a3cdb44aa1c0815660f",
    "6656fb154a4f9b78a7654306"
]
// Dữ liệu mẫu
const sampleCategories = CategoryImage.map((img, idx) => {
    const names = [
        "Móc khóa",
        "Bưu thiếp & Postcard",
        "Lọ thông điệp & lọ thủy tinh",
        "Hộp nhạc",
        "Gấu bông",
        "Khung ảnh",
        "Lồng đèn & trang trí truyền thống",
        "Tượng gốm & đồ gốm trang trí",
        "Quạt giấy & văn hóa dân gian",
        "Vòng tay handmade",
        "Sổ tay & Giấy kraft",
        "Bình hoa gốm",
        "Chặn sách nghệ thuật",
        "Đèn giấy & đồ trang trí nghệ thuật",
        "Túi vải & đồ dùng học sinh"
    ];
    const descriptions = [
        "Các loại móc khóa độc đáo, khắc tên theo yêu cầu.",
        "Bưu thiếp in hình danh lam thắng cảnh Việt Nam.",
        "Lọ thủy tinh nhỏ chứa điều ước, giấy ghi lời chúc.",
        "Hộp nhạc cơ bằng gỗ, xoay tay, phong cách cổ điển.",
        "Gấu bông mini, handmade, dễ thương làm quà tặng.",
        "Khung ảnh treo dây, trang trí hình ảnh kỷ niệm.",
        "Lồng đèn giấy xếp, đèn trung thu truyền thống.",
        "Tượng gốm nhỏ hình con vật, thủ công mỹ nghệ.",
        "Quạt giấy truyền thống, in họa tiết Việt Nam.",
        "Vòng tay thủ công, đan tay, nhiều mẫu mã độc đáo.",
        "Sổ tay phong cách cổ điển, giấy kraft thân thiện.",
        "Bình hoa mini bằng gốm, trang trí bàn học hoặc phòng khách.",
        "Đồ dùng kệ sách kết hợp trang trí thủ công.",
        "Đèn ngủ bằng giấy mỹ thuật, đèn trang trí handmade.",
        "Túi vải canvas, túi tote in hình, quà tặng học sinh."
    ];
    return {
        name: names[idx],
        description: descriptions[idx],
        image: CategoryImage[Math.floor(Math.random() * CategoryImage.length)]
    };
});

const sampleProducts = [
    {
        name: "Móc khóa gỗ khắc tên",
        description: "Móc khóa làm từ gỗ tự nhiên, khắc tên theo yêu cầu.",
        rating: 4.8,
        price: 30000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 200,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Postcard cảnh đẹp Đà Nẵng",
        description: "Bộ 10 tấm bưu thiếp in hình danh lam thắng cảnh Đà Nẵng.",
        rating: 4.6,
        price: 40000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 150,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Lọ thủy tinh kèm thông điệp",
        description: "Lọ thủy tinh nhỏ đựng giấy cuộn viết điều ước, quà tặng ý nghĩa.",
        rating: 4.7,
        price: 50000,
        discount: 10,
        Coupon: null,
        images: images,
        quantity: 100,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Hộp nhạc gỗ mini",
        description: "Hộp nhạc cơ xoay bằng tay, thiết kế vintage.",
        rating: 4.9,
        price: 150000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 80,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Gấu bông handmade mini",
        description: "Gấu bông nhỏ xinh được khâu tay hoàn toàn.",
        rating: 4.5,
        price: 70000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 60,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Khung ảnh treo tường mini",
        description: "Khung ảnh treo dây, gắn hình kỷ niệm, tặng kèm kẹp gỗ.",
        rating: 4.4,
        price: 95000,
        discount: 10,
        Coupon: null,
        images: images,
        quantity: 70,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Lồng đèn giấy xếp",
        description: "Lồng đèn giấy xếp truyền thống, dùng trang trí hoặc làm quà tặng.",
        rating: 4.3,
        price: 60000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 120,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Tượng gốm nhỏ trang trí",
        description: "Tượng gốm thủ công với hình dáng động vật dễ thương.",
        rating: 4.6,
        price: 90000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 50,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Quạt giấy in hoa văn",
        description: "Quạt giấy truyền thống có hoa văn cổ điển Việt Nam.",
        rating: 4.5,
        price: 30000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 110,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Vòng tay handmade",
        description: "Vòng tay tết thủ công, nhiều màu sắc, kèm charm.",
        rating: 4.6,
        price: 25000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 300,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Sổ tay bìa da vintage",
        description: "Sổ tay bìa da ép logo, giấy kraft, phong cách cổ điển.",
        rating: 4.7,
        price: 120000,
        discount: 15,
        Coupon: null,
        images: images,
        quantity: 45,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Bình hoa gốm mini",
        description: "Bình gốm trang trí bàn làm việc, có nhiều mẫu họa tiết.",
        rating: 4.4,
        price: 60000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 70,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Chặn sách gỗ nghệ thuật",
        description: "Cặp chặn sách bằng gỗ khắc họa tiết truyền thống.",
        rating: 4.5,
        price: 140000,
        discount: 10,
        Coupon: null,
        images: images,
        quantity: 35,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Đèn ngủ bằng giấy nghệ thuật",
        description: "Đèn bàn làm từ giấy mỹ thuật, phát sáng dịu nhẹ.",
        rating: 4.6,
        price: 180000,
        discount: 10,
        Coupon: null,
        images: images,
        quantity: 40,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Túi vải canvas in hình",
        description: "Túi vải canvas in hình hoạt họa hoặc phong cảnh Việt Nam.",
        rating: 4.7,
        price: 85000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 100,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Mô hình thuyền buồm gỗ",
        description: "Mô hình thuyền buồm nhỏ bằng gỗ, tượng trưng cho may mắn.",
        rating: 4.8,
        price: 220000,
        discount: 10,
        Coupon: null,
        images: images,
        quantity: 20,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Hũ điều ước mini",
        description: "Hũ nhỏ đựng giấy ghi lời chúc, tình cảm tặng bạn bè.",
        rating: 4.5,
        price: 35000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 130,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Nến thơm trang trí",
        description: "Nến thơm handmade hương lavender, dùng làm quà tặng.",
        rating: 4.6,
        price: 75000,
        discount: 5,
        Coupon: null,
        images: images,
        quantity: 90,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    },
    {
        name: "Bảng tên để bàn gỗ",
        description: "Bảng khắc tên mini để bàn làm quà sinh nhật, quà tặng công ty.",
        rating: 4.4,
        price: 95000,
        discount: 0,
        Coupon: null,
        images: images,
        quantity: 60,
        categories: `${Math.floor(Math.random() * 15) + 1}`,
        like_count: 0,
        view_count: 0,
        sell_count: 0
    }
    // ... Thêm các sản phẩm khác nếu cần ...
];

// Hàm seed vào DB
async function seedProducts() {
  try {
    const insertCategory = await Categories.insertMany(sampleCategories);
    console.log("✅ Đã seed xong 15 danh mục mẫu.");

    const categoryIds = insertCategory.map(cat => cat._id.toString());
    sampleProducts.forEach(product => {
      product.categories = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    });
    
    await Product.insertMany(sampleProducts);
    console.log("✅ Đã seed xong 20 sản phẩm mẫu.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    mongoose.connection.close();
  }
}

seedProducts();