FROM node:20.18.0-alpine

WORKDIR /app

COPY ./package*.json ./
RUN yarn install
COPY . ./
RUN yarn build