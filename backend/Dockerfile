FROM node:lts

WORKDIR /app/backend

COPY package*.json ./

RUN npm i
RUN npm install multer

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

