
# Use official Node.js LTS image
FROM node:20-alpine AS base

# Install turbo globally
RUN npm install -g turbo

FROM base AS builder

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy all workspace package.json files
COPY apps/mqtt-broker/package*.json ./apps/mqtt-broker/
# If you have shared packages, copy their package.json files too
# COPY packages/*/package.json ./packages/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the mqtt-broker app (and its dependencies)
RUN turbo run build --filter=mqtt-broker...

FROM base AS runner

WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mqttuser

# Copy built application
COPY --from=builder --chown=mqttuser:nodejs /app/apps/mqtt-broker ./
COPY --from=builder --chown=mqttuser:nodejs /app/node_modules ./node_modules

USER mqttuser

# Expose MQTT ports
EXPOSE 1883 8883

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
