# Digital Student Registration - Multi-Stage Dockerfile
# Optimized for production deployment with minimal image size

# Stage 1: Base image with Node.js
FROM node:22.20.0-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile for reproducible builds
RUN yarn install --frozen-lockfile --production=false

# Stage 3: Build the application
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
# Increase memory limit for large builds
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build

# Stage 4: Production runtime
FROM base AS runner

WORKDIR /app

# Don't run as root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy health check script
COPY --from=builder /app/scripts/docker-healthcheck.sh ./scripts/
RUN chmod +x ./scripts/docker-healthcheck.sh

# Set ownership for nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check using the health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ./scripts/docker-healthcheck.sh || exit 1

# Start the application
CMD ["node", "server.js"]
