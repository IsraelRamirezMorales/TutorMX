FROM node:20-alpine

WORKDIR /app

# Copy package lock and JSON files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy application files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
