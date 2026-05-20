FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency descriptors and install packages
COPY package*.json ./
RUN npm install --production

# Copy application files (frontend and backend unified)
COPY . .

# Expose server port
EXPOSE 8085

# Define start command
CMD ["npm", "start"]
