# שלב 1: בניית אפליקציה
FROM node:18 AS build

# צור תיקיית עבודה
WORKDIR /app

# העתק קבצי תלות בלבד (לביצוע cache)
COPY package*.json ./

# התקנת תלויות
RUN npm install

# העתק את שאר קבצי הפרויקט
COPY . .

# בנייה
RUN npm run build

# שלב 2: שרת הפצה (Nginx)
FROM nginx:alpine

# העתק את התוכן של build (Vite = dist)
COPY --from=build /app/dist /usr/share/nginx/html

# חשיפת פורט 80
EXPOSE 80

# הרצת Nginx
CMD ["nginx", "-g", "daemon off;"]
