FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# העתקת קובץ .env אם אתה רוצה (לא חובה ב־production)
# COPY .env .env

EXPOSE 5000
CMD ["node", "server.js"]
