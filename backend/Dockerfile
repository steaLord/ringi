# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the backend port
EXPOSE 4000

# Start the app in production mode
CMD ["npm", "run", "start"]
