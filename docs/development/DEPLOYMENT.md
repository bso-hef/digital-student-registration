# Docker Deployment Guide

Production deployment using Docker Compose.

## Prerequisites

- Docker Engine 24.0+
- Docker Compose 2.0+
- 2GB RAM, 10GB disk space

## Quick Start

```bash
# Copy and edit environment file
cp .env.example .env
nano .env

# Start services
docker compose --profile linux up -d --build    # Linux
docker compose --profile windows up -d --build  # Windows

# Check status
docker compose ps
docker compose logs -f
```

## Environment Setup

Required variables in `.env`:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

MONGO_PASSWORD=your_secure_password
REDIS_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_64_char_secret
```

Generate secrets:

```bash
openssl rand -base64 64 | tr -d "=+/" | cut -c1-64
```

## Common Commands

```bash
# Start/stop
docker compose --profile linux up -d
docker compose down

# Logs
docker compose logs -f app

# Restart
docker compose restart app

# Health check
curl http://localhost:3000/api/health/live

# Remove all (including data)
docker compose down -v
```

## Backup

```bash
# Backup MongoDB
docker compose exec mongo mongodump \
  --username admin --password your_password \
  --authenticationDatabase admin --out /data/backup
docker compose cp mongo:/data/backup ./backup_$(date +%Y%m%d)

# Restore
docker compose cp ./backup mongo:/data/restore
docker compose exec mongo mongorestore \
  --username admin --password your_password \
  --authenticationDatabase admin /data/restore
```

## Troubleshooting

```bash
# View logs
docker compose logs -f app

# Restart services
docker compose restart

# Clear all and restart
docker compose down -v
docker compose --profile linux up -d

# Check resources
docker stats
```

## Updates

```bash
git pull
docker compose --profile linux up -d --build
docker compose logs -f app
```
