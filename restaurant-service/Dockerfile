# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (should match your service port)
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
