FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Dev server command
CMD ["npm", "run", "dev"]