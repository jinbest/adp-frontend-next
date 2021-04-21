#_____________________________ Builder Stage __________________________
FROM node:14.15.1-alpine as build

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY . ./

RUN npm install --quiet && npm run build

#__________________________ Production Stage ___________________________
FROM nginx:1.17-alpine

WORKDIR /app

RUN apk --update add nodejs-current npm supervisor

RUN mkdir -p /var/log/supervisor && mkdir -p /etc/supervisor/conf.d

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/.next ./.next

COPY --from=build /app/package*.json ./

RUN npm install --quiet --production

# supervisor base configuration
ADD supervisor.conf /etc/supervisor.conf

EXPOSE 4001

# start supervisord (run nextjs and nginx)
CMD supervisord -c /etc/supervisor.conf