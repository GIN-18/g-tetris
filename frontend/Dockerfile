FROM node:alpine as builder

WORKDIR /build

COPY package*.json /build

RUN npm install

COPY . /build

RUN npm run build

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80
