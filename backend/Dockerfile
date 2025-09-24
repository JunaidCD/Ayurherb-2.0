FROM node:18

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing node_modules and package-lock to ensure clean install
RUN rm -rf node_modules package-lock.json

# Install dependencies with rebuild for container architecture
RUN npm install --build-from-source
RUN npm rebuild sqlite3 --build-from-source

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p data uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
