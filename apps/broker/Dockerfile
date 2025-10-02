
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
COPY apps/broker/package*.json ./apps/broker/
# If you have shared packages, copy their package.json files too
# COPY packages/*/package.json ./packages/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the mqtt-broker app (and its dependencies) if needed
# RUN turbo run build --filter=mqtt-broker...

FROM base AS runner

WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mqttuser

# Copy the entire built workspace
COPY --from=builder --chown=mqttuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mqttuser:nodejs /app/package*.json ./
COPY --from=builder --chown=mqttuser:nodejs /app/apps/broker ./apps/broker

# Set working directory to the app
WORKDIR /app/apps/broker

USER mqttuser

# Expose MQTT ports
EXPOSE 1883 8883

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
