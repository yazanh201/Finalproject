# שלב 1: בניית אפליקציה
FROM node:18 AS build

# צור תיקיית עבודה
WORKDIR /app

# העתק קבצי תלות בלבד (כדי לאפשר cache בשכבות Docker)
COPY package*.json ./

# התקנת תלויות
RUN npm install

# העתק את שאר קבצי הפרויקט
COPY . .

# בנייה (Vite יפיק את התוכן לתוך dist/)
RUN npm run build

# שלב 2: שרת הפצה (Nginx)
FROM nginx:alpine

# העתק קובץ קונפיג Nginx עם תמיכה ב-client side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# העתק את תוצרי הבנייה (dist) אל תוך תקיית ההגשה של Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# פתיחת פורט 80
EXPOSE 80

# הפעלת Nginx
CMD ["nginx", "-g", "daemon off;"]
