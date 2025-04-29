# Use the official Node.js image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the payment service runs on
EXPOSE 5003

# Run the application
CMD ["npm", "start"]
