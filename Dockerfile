# Digital Student Registration - Production Dockerfile
# Multi-stage build optimized for production deployment

# Stage 1: Base image with Node.js and Yarn
FROM node:22.20.0-alpine AS base

# Yarn 1.22.22 is already pre-installed in node:22.20.0-alpine
# No need to install libc6-compat or yarn again

WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

# Stage 3: Build the application
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time arguments for NEXT_PUBLIC variables
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Validate and display build configuration
# This helps debug port configuration issues in Docker deployments
RUN echo "========================================" && \
    echo "Build Configuration:" && \
    echo "  NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}" && \
    echo "  NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" && \
    echo "========================================" && \
    if [ -z "$NEXT_PUBLIC_APP_URL" ]; then \
      echo "WARNING: NEXT_PUBLIC_APP_URL is not set. Using relative URLs for API calls." && \
      echo "This is acceptable since the app uses relative URLs for same-origin API calls."; \
    fi && \
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then \
      echo "WARNING: NEXT_PUBLIC_API_URL is not set. Using relative URLs for API calls." && \
      echo "This is acceptable since the app uses relative URLs for same-origin API calls."; \
    fi

RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build && \
    find .next -name "*.map" -type f -delete && \
    rm -rf .next/cache

# Stage 4: Production runtime
FROM node:22.20.0-alpine AS runner

WORKDIR /app

# Accept port as build argument
ARG APP_PORT=3000

RUN apk add --no-cache wget dumb-init && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=${APP_PORT}
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Create logs directory with proper ownership
RUN mkdir -p ./logs/server-logs && \
    chown -R nextjs:nodejs ./logs

USER nextjs

EXPOSE ${APP_PORT}

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

LABEL maintainer="Digital Student Registration Team"
LABEL description="Production Docker image for Digital Student Registration"
LABEL version="1.0.0"
