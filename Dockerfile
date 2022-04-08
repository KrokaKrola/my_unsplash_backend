FROM node:14-alpine

RUN mkdir -p /usr/app

RUN apk add --no-cache libc6-compat git openssl

WORKDIR /usr/app

# COPY . .
# COPY package*.json ./

# RUN npm install

# RUN npx prisma generate

# CMD npm run dev
