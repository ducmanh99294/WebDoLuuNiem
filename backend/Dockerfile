FROM node:lts

# Set working directory
WORKDIR /app/backend

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Cài thêm multer nếu chưa có trong package.json (nên thêm vào file thay vì cài riêng)
# RUN npm install multer  <-- bỏ nếu đã có trong package.json

# Copy toàn bộ source code
COPY . .

# Reindex MeiliSearch trước khi start
RUN node scripts/setupMeilisearch.js

# Expose port
EXPOSE 3000

# Start server sau khi reindex (dùng entrypoint là script)
CMD ["sh", "-c", "node scripts/reindexProducts.js && npm run start"]