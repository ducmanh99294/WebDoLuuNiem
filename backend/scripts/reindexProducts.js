// scripts/reindexProducts.js

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../src/models/Product'); // sửa lại đúng path của bạn
const client = require('../src/config/meiliSearchConfig'); // sửa đúng path tới file Meilisearch config

(async () => {
  try {

    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error('❌ MONGO_URL is undefined in .env file');

    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const allProducts = await Product.find().lean();
    if (allProducts.length === 0) {
      console.log('No products found in MongoDB');
      process.exit(0);
    }

    const index = client.index('products');
    const task = await index.addDocuments(allProducts); // đẩy toàn bộ lên Meilisearch

    console.log('Indexing submitted with task UID:', task.taskUid);
  } catch (err) {
    console.error('Failed to reindex:', err);
  } finally {
    mongoose.connection.close();
  }
})();