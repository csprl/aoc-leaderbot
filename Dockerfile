FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
CMD ["node", "bot.js"]