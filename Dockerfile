# syntax=docker/dockerfile:1

FROM node:16.13.2
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .


EXPOSE 3000
CMD [ "node", "-r", "dotenv/config", "app.js" ]
