\# שלב 1: בניית אפליקציית React
FROM node:20 AS build

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת קבצי package.json ו-lock בלבד בשלב ראשון (כדי להשתמש ב-layer cache)
COPY package*.json ./

# התקנת התלויות
RUN npm install

# העתקת שאר קבצי הפרויקט
COPY . .

# הרצת הבנייה
RUN npm run build

# שלב 2: הגשה עם Nginx
FROM nginx:alpine

# העתקת קבצי הבנייה ל-nginx
COPY --from=build /app/build /usr/share/nginx/html

# קובץ קונפיגורציה מותאם ל־React Router (אם צריך)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# פתיחת פורט
EXPOSE 80

# הפעלת nginx
CMD ["nginx", "-g", "daemon off;"]
