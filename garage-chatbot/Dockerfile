# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port (הפורט שהשרת מאזין לו)
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
