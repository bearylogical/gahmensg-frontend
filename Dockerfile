# Use a Node.js base image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally in the Docker image
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --prod

# Copy source code
COPY . .

# Build the SvelteKit application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from the build stage
COPY --from=build /app/build .

# Expose the port SvelteKit listens on (default for adapter-node is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]