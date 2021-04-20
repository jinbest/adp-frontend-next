#_____________________________ Builder Stage __________________________
FROM node:14.15.1-alpine as build

WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY tsconfig*.json ./

COPY . ./

RUN npm install --quiet && npm run build

#__________________________ Production Stage ___________________________
FROM nginx:1.17-alpine

WORKDIR /app

COPY package.json ./

RUN apk --update add nodejs-current npm supervisor

RUN npm install --production

RUN mkdir -p /var/log/supervisor && mkdir -p /etc/supervisor/conf.d

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

# COPY --from=build /app/.next /usr/share/nginx/html
COPY --from=build /app/.next ./.next

# COPY --from=build /app/node_modules ./node_modules

# supervisor base configuration
ADD supervisor.conf /etc/supervisor.conf

EXPOSE 4001

# CMD ["nginx", "-g", "daemon off;"]

# start supervisord (run nextjs and nginx)
CMD supervisord -c /etc/supervisor.conf