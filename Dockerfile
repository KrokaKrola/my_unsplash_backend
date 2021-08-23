FROM node:14-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY . .

COPY package*.json ./

RUN npm install

CMD npm run dev
