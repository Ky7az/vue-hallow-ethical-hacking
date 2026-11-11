FROM node:22.22.1-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build
