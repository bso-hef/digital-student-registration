# Digital Student Registration - Production Dockerfile
# Multi-stage build optimized for production deployment

# Stage 1: Base image with Node.js and Yarn
FROM node:22.20.0-alpine AS base

RUN apk add --no-cache libc6-compat && \
    npm install -g yarn@1.22.22

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

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build && \
    find .next -name "*.map" -type f -delete && \
    rm -rf .next/cache

# Stage 4: Production runtime
FROM node:22.20.0-alpine AS runner

WORKDIR /app

RUN apk add --no-cache wget dumb-init && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

LABEL maintainer="Digital Student Registration Team"
LABEL description="Production Docker image for Digital Student Registration"
LABEL version="1.0.0"
