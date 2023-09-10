FROM node:16.20.2-alpine

WORKDIR /app

COPY ./package*.json ./
RUN yarn install
COPY . ./
RUN yarn build