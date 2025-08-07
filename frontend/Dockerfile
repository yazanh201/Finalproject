# שלב 1: בניית אפליקציית React
FROM node:20 AS build

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת קבצי הפרויקט
COPY . .

# התקנת חבילות
RUN npm install

# בניית האפליקציה
RUN npm run build

# שלב 2: הגשת האפליקציה באמצעות Nginx
FROM nginx:alpine

# אם אתה משתמש ב-Vite, השתמש בתיקיית dist
# אם אתה משתמש ב-create-react-app, השתמש בתיקיית build

# כאן נניח שאתה משתמש ב-Vite (אפשר לשנות ל-build אם צריך)
COPY --from=build /app/dist /usr/share/nginx/html

# העתקת קובץ קונפיג של nginx (אם יש לך אחד מותאם אישית)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# פתיחת פורט
EXPOSE 80

# הפעלת nginx
CMD ["nginx", "-g", "daemon off;"]
