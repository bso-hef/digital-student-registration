# Docker Deployment Guide

Docker deployment guide for Digital Student Registration.

## ⚠️ CRITICAL: QR Code URLs

**QR codes contain URLs embedded at BUILD TIME!**

If you deploy without setting production URLs, **all QR codes will contain `localhost:3000`**.

**REQUIRED before building:**

```bash
export NEXT_PUBLIC_APP_URL=https://your-domain.com
export NEXT_PUBLIC_API_URL=https://your-domain.com
export NEXTAUTH_URL=https://your-domain.com
```

The application **fails to start** in production if URLs contain "localhost" (v2.1.0+).

---

## Prerequisites

**Required:**

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum (8GB recommended)

**Linux:**

```bash
chmod +x scripts/*.sh
```

**Windows:**

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Quick Start

### Production Deployment

```bash
# 1. Configure .env
cp .env.example .env
# Edit: Set NEXT_PUBLIC_APP_URL, MONGO_USER, MONGO_PASSWORD, REDIS_PASSWORD, NEXTAUTH_SECRET

# 2. Export URLs for build
export $(grep "NEXT_PUBLIC" .env | xargs)

# 3. Build
./scripts/docker-build.sh --no-cache    # Linux
.\scripts\docker-build.ps1 -NoCache    # Windows

# 4. Deploy
docker compose --profile linux up -d    # Linux
docker compose --profile windows up -d  # Windows

# 5. Verify
docker compose ps
docker compose logs app | grep "Configuration validation"
```

### Development (Local)

For local development, just use `yarn dev` without Docker.

---

## Port Configuration

**Internal port:** Always 3000 (Next.js standard, fixed)
**External port:** Configurable via `APP_PORT` in `.env`

```bash
# .env
APP_PORT=3000  # Maps to 3000:3000
APP_PORT=8080  # Maps to 8080:3000
```

Docker mapping: `host_port:container_port` (only host port changes)

---

## Environment Variables

### Required

| Variable              | Example              | When           |
| --------------------- | -------------------- | -------------- |
| `NEXT_PUBLIC_APP_URL` | `https://school.com` | **BUILD TIME** |
| `NEXT_PUBLIC_API_URL` | `https://school.com` | **BUILD TIME** |
| `NEXTAUTH_URL`        | `https://school.com` | **BUILD TIME** |
| `MONGO_USER`          | `admin`              | Runtime        |
| `MONGO_PASSWORD`      | `[password]`         | Runtime        |
| `REDIS_PASSWORD`      | `[password]`         | Runtime        |
| `NEXTAUTH_SECRET`     | `[64 chars]`         | Runtime        |

### Optional (with defaults)

| Variable      | Default                        |
| ------------- | ------------------------------ |
| `APP_PORT`    | `3000`                         |
| `MONGO_DB`    | `digital-student-registration` |
| `APP_VERSION` | From `package.json`            |

**Generate secrets:**

```bash
openssl rand -base64 64 | tr -d "=+/" | cut -c1-64
```

---

## Docker Architecture

```yaml
services:
  app-linux: # Next.js application (Alpine Linux)
  app-windows: # Next.js application (Windows Server Core)
  mongo: # MongoDB 7.0 database
  redis: # Redis 7 cache

volumes:
  mongo-data: # Persistent MongoDB data
  redis-data: # Persistent Redis data

networks:
  app-network: # Internal bridge network
```

---

## Production Setup

### Step-by-Step

1. **Set environment variables** in `.env`
2. **Build Docker image** with production URLs
3. **Start services** with Docker Compose
4. **Verify deployment** (logs, health checks)
5. **Test QR codes** (CRITICAL!)

### Verify QR Codes

```bash
# After deployment, test QR codes:
# 1. Login to admin panel
# 2. Generate QR code for a student
# 3. Scan with phone
# 4. URL MUST be your production domain, NOT localhost
```

If QR code shows localhost, rebuild with correct URLs.

---

## SSL/HTTPS Configuration

**Recommended:** Use reverse proxy (nginx/Caddy) for SSL termination.

Application runs HTTP internally, proxy handles HTTPS externally.

### Example: nginx

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Example: Caddy

```caddy
your-domain.com {
    reverse_proxy localhost:3000
}
```

Caddy automatically handles SSL with Let's Encrypt.

---

## Maintenance

### Logs

```bash
docker compose logs -f app
docker compose logs --tail=100 app
```

### Restart

```bash
docker compose restart app
docker compose restart
```

### Update

```bash
git pull
docker compose --profile linux up -d --build
```

### Backup

```bash
# Backup MongoDB
docker compose exec mongo mongodump \
  --username admin --password $MONGO_PASSWORD \
  --authenticationDatabase admin --out /data/backup
docker compose cp mongo:/data/backup ./backup-$(date +%Y%m%d)

# Restore
docker compose cp ./backup mongo:/data/restore
docker compose exec mongo mongorestore \
  --username admin --password $MONGO_PASSWORD \
  --authenticationDatabase admin /data/restore
```

---

## Troubleshooting

### QR Codes Show localhost

**Problem:** QR codes contain `localhost:3000`

**Solution:**

```bash
export NEXT_PUBLIC_APP_URL=https://your-domain.com
export NEXT_PUBLIC_API_URL=https://your-domain.com
./scripts/docker-build.sh --no-cache
docker compose down && docker compose --profile linux up -d
```

### Validation Error on Startup

**Error:** `Configuration validation failed: NEXT_PUBLIC_APP_URL contains 'localhost'`

**Solution:** Rebuild with correct URLs (same as above).

### Port Already in Use

```bash
# Check port usage
lsof -i :3000              # Linux/macOS
netstat -ano | findstr :3000  # Windows

# Solution: Change APP_PORT in .env or stop conflicting service
```

### Container Won't Start

```bash
# Check logs
docker compose logs app

# Check environment
docker compose config | grep environment

# Check image exists
docker images | grep dsr-app
```

### Permission Denied (Linux)

```bash
chmod +x scripts/*.sh
sudo usermod -aG docker $USER
# Log out and back in
```

### Database Connection Failed

```bash
# Check MongoDB
docker compose logs mongo

# Test connection
docker compose exec mongo mongosh \
  --username admin --password $MONGO_PASSWORD \
  --authenticationDatabase admin
```

---

## Common Commands

```bash
# Status
docker compose ps
docker stats

# Start/Stop
docker compose up -d
docker compose down
docker compose restart

# Rebuild
docker compose up -d --build

# Clean up
docker compose down -v  # WARNING: Deletes data!

# Shell access
docker compose exec app sh
docker compose exec mongo mongosh

# Resource usage
docker system df
```

---

## Health Checks

Docker automatically performs health checks every 30 seconds:

```yaml
healthcheck:
  test: wget -q --spider http://localhost:3000/api/health/live
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

**Manual check:**

```bash
curl http://localhost:3000/api/health/live
curl http://localhost:3000/api/health/full
```

---

## Security Best Practices

- ✅ Strong passwords (20+ characters)
- ✅ Rotate secrets every 90 days
- ✅ Use reverse proxy for SSL
- ✅ Regular backups
- ✅ Keep images updated
- ✅ Don't commit `.env` to git
- ✅ Limit container resources
- ✅ Monitor logs for suspicious activity

---

## Additional Resources

- [DEPLOYMENT.md](docs/development/DEPLOYMENT.md) - Step-by-step deployment guide
- [Docker Docs](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Issues](https://github.com/bso-hef/digital-student-registration/issues)
