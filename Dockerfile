# Use a Node.js base image


FROM node:20-alpine AS build

ARG PUBLIC_API_URL
ARG PUBLIC_BEARER_TOKEN

ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_BEARER_TOKEN=$PUBLIC_BEARER_TOKEN
# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally in the Docker image
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the SvelteKit application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from the build stage
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=build /app/node_modules /app/node_modules

# COPY static files if needed
COPY static /app/static

# Expose the port SvelteKit listens on (default for adapter-node is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "build"]