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

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
WORKDIR /app/apps/broker
RUN npm run build

FROM base AS runner

WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mqttuser

# Copy production dependencies only
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/broker/package*.json ./apps/broker/

# Install only production dependencies
WORKDIR /app/apps/broker
RUN npm install --omit=dev

# Copy the compiled JavaScript from dist folder
COPY --from=builder --chown=mqttuser:nodejs /app/apps/broker/dist ./dist

# Copy .env file if it exists (optional)
COPY --from=builder --chown=mqttuser:nodejs /app/apps/broker/.env* ./ 2>/dev/null || true

USER mqttuser

# Expose MQTT ports
EXPOSE 1883 8883

# Set environment to production
ENV NODE_ENV=production

# Start the application using the compiled JavaScript
CMD ["node", "dist/index.js"]
