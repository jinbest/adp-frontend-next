#_____________________________ Builder Stage __________________________
FROM node:14.15.1-alpine as builder

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY . ./

RUN npm install --quiet && npm run build

#__________________________ Production Stage ___________________________
FROM nginx:1.17-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 4001

CMD ["nginx", "-g", "daemon off;"]