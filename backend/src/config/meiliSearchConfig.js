// meilisearchClient.js
require('dotenv').config();
const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://meilisearch:7701',
  apiKey: process.env.MEILISEARCH_API_KEY || '',
});

module.exports = client;
