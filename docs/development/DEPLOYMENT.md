# Production Deployment Guide

Quick guide for deploying Digital Student Registration to production with Docker.

## Prerequisites

**Required:**

- Docker Engine 24.0+, Docker Compose 2.0+
- 4GB RAM minimum (8GB recommended)

**Linux - Make scripts executable:**

```bash
chmod +x scripts/*.sh
```

**Windows - Allow PowerShell scripts:**

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## ⚠️ CRITICAL: QR Code URLs

**QR codes contain URLs that are embedded at BUILD TIME!**

Using `localhost` in production = **broken QR codes**.

**REQUIRED before building:**

```bash
export NEXT_PUBLIC_APP_URL=https://your-domain.com
export NEXT_PUBLIC_API_URL=https://your-domain.com
export NEXTAUTH_URL=https://your-domain.com
```

The application **will fail to start** in production if URLs contain "localhost" (v2.1.0+).

---

## Quick Start

### 1. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env and set:
# - NEXT_PUBLIC_APP_URL (your production domain!)
# - NEXT_PUBLIC_API_URL (your production domain!)
# - NEXTAUTH_URL (your production domain!)
# - MONGO_USER, MONGO_PASSWORD
# - REDIS_PASSWORD
# - NEXTAUTH_SECRET (generate: openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
```

### 2. Build & Deploy

**Linux:**

```bash
# Load environment variables
export $(grep -v '^#' .env | xargs)

# Build (script warns if URLs not set)
./scripts/docker-build.sh --no-cache

# Deploy
docker compose --profile linux up -d
```

**Windows:**

```powershell
# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -notmatch '^\s*#' -and $_ -match '=') {
        $key, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), 'Process')
    }
}

# Build
.\scripts\docker-build.ps1 -NoCache -LinuxImage

# Deploy
docker compose --profile linux up -d
```

### 3. Verify

```bash
# Check status (should show "healthy" after ~60s)
docker compose ps

# Check for validation errors
docker compose logs app | grep "Configuration validation"
# Should NOT see "localhost" errors

# Test QR code (CRITICAL!)
# 1. Login: https://your-domain.com/login
# 2. Generate QR code for a student
# 3. Scan with phone - URL should be your domain, NOT localhost
```

---

## Port Configuration

**Internal port:** Always 3000 (fixed, Next.js default)
**External port:** Configurable via `APP_PORT` in `.env`

```bash
# .env
APP_PORT=3000    # Access at localhost:3000 (mapped as 3000:3000)
APP_PORT=8080    # Access at localhost:8080 (mapped as 8080:3000)
```

Docker mapping: `host_port:3000` (only left side changes)

---

## Environment Variables

### Required (must be set)

| Variable              | Example                      | When Set       |
| --------------------- | ---------------------------- | -------------- |
| `NEXT_PUBLIC_APP_URL` | `https://school.example.com` | **BUILD TIME** |
| `NEXT_PUBLIC_API_URL` | `https://school.example.com` | **BUILD TIME** |
| `NEXTAUTH_URL`        | `https://school.example.com` | **BUILD TIME** |
| `MONGO_USER`          | `admin`                      | Runtime        |
| `MONGO_PASSWORD`      | `[strong password]`          | Runtime        |
| `REDIS_PASSWORD`      | `[strong password]`          | Runtime        |
| `NEXTAUTH_SECRET`     | `[64 chars]`                 | Runtime        |

### Optional (with defaults)

| Variable      | Default                        |
| ------------- | ------------------------------ |
| `APP_PORT`    | `3000`                         |
| `MONGO_DB`    | `digital-student-registration` |
| `APP_VERSION` | From `package.json`            |

**Note:** `NEXT_PUBLIC_*` variables are embedded at build time. Changing them requires rebuilding the image.

---

## Common Issues

### 1. QR Codes Show localhost

**Problem:** QR codes contain `http://localhost:3000` instead of production domain

**Solution:**

```bash
# Set production URLs
export NEXT_PUBLIC_APP_URL=https://your-domain.com
export NEXT_PUBLIC_API_URL=https://your-domain.com

# REBUILD image (required!)
./scripts/docker-build.sh --no-cache

# Restart
docker compose down
docker compose --profile linux up -d
```

### 2. Validation Error on Startup

**Error:** `Configuration validation failed: NEXT_PUBLIC_APP_URL contains 'localhost'`

**Solution:** Same as above - rebuild with correct URLs.

### 3. Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000        # Linux/macOS
netstat -ano | findstr :3000  # Windows

# Solution: Change APP_PORT in .env or stop conflicting service
```

### 4. Permission Denied (Linux)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### 5. Container Won't Start

```bash
# Check logs
docker compose logs app

# Check all environment variables are set
docker compose config | grep environment

# Verify image exists
docker images | grep dsr-app
```

---

## Maintenance

### View Logs

```bash
docker compose logs -f app
docker compose logs --tail=100 app
```

### Restart

```bash
docker compose restart app
docker compose down && docker compose --profile linux up -d
```

### Update

```bash
git pull
docker compose --profile linux up -d --build
```

### Backup MongoDB

```bash
docker compose exec mongo mongodump \
  --username admin --password $MONGO_PASSWORD \
  --authenticationDatabase admin --out /data/backup
docker compose cp mongo:/data/backup ./backup-$(date +%Y%m%d)
```
