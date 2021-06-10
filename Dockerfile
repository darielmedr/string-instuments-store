# Stage 1

FROM node:14.16.1 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

# Stage 2

FROM nginx:1.19.10-alpine

COPY --from=build-step /app/dist/luthier-otero-admin-dashboard /usr/share/nginx/html