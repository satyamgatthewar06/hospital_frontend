# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY hospitalmanagement/package*.json ./
RUN npm install
COPY hospitalmanagement/ .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY hospitalmanagement/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
