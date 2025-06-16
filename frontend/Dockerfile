# שלב 1: בניית האפליקציה
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# שלב 2: הגשה עם Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
