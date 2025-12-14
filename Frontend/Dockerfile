# Use official Node.js image
FROM node:22.21.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Expose frontend port
EXPOSE 8080

# Start frontend
CMD ["npm", "run", "dev"]
