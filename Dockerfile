#___________________________ Dependency Installation Stage __________________________
FROM node:14.15.1-alpine as deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

#_________________________________ Builder Stage ____________________________________

FROM node:14.15.1-alpine as builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY tsconfig*.json ./

COPY . ./

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

#_________________________________ Production Stage _________________________________

FROM nginx:1.19.10-alpine

RUN apk add --no-cache libc6-compat nodejs=14.17.4-r0 npm supervisor

WORKDIR /app

RUN mkdir -p /var/log/supervisor && mkdir -p /etc/supervisor/conf.d

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# supervisor base configuration
ADD supervisor.conf /etc/supervisor.conf

EXPOSE 4001 3000 3001 3002

# start supervisord (run nextjs and nginx)
CMD supervisord -c /etc/supervisor.conf