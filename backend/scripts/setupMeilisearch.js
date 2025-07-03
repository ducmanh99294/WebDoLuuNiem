require('dotenv').config({ path: '../.env' });
const client = require('../src/config/meiliSearchConfig');

(async () => {
  try {
    const index = client.index('products');

    await index.updateSearchableAttributes(['name', 'description']);

    console.log('MeiliSearch index configured');
  } catch (err) {
    console.error('Error configuring MeiliSearch:', err.message);
  }
})();