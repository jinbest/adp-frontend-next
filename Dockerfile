#_____________________________ Builder Stage __________________________
FROM node:14.15.1-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

#__________________________ Production Stage ___________________________
FROM nginx:1.17-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/.next /usr/share/nginx/html

EXPOSE 4001

CMD ["nginx", "-g", "daemon off;"]