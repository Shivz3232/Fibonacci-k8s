# Build the react app
FROM node:alpine as builder

WORKDIR '/home/app'

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

# Port the build to Nginx
FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /home/app/build  /usr/share/nginx/html