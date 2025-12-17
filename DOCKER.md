# Docker Deployment Guide

This guide covers how to deploy and run the Digital Student Registration application using Docker and Docker Compose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Development](#development)
  - [Production](#production)
- [Configuration](#configuration)
- [Docker Architecture](#docker-architecture)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [SSL/HTTPS Configuration](#sslhttps-configuration)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
  - [Install Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- **Docker Compose**: Version 2.0 or higher (included with Docker Desktop)

### System Requirements

- **Minimum**:
  - 2 CPU cores
  - 4 GB RAM
  - 5 GB available disk space

- **Recommended**:
  - 4+ CPU cores
  - 8+ GB RAM
  - 10+ GB available disk space
  - SSD storage for database

### Verify Installation

```bash
# Check Docker version
docker --version
# Expected: Docker version 20.10.x or higher

# Check Docker Compose version
docker-compose --version
# Expected: Docker Compose version 2.x.x or higher

# Verify Docker is running
docker ps
# Should show empty list or running containers (no errors)
```

---

## Quick Start

### Development

```bash
# 1. Clone the repository (if not already done)
git clone <repository-url>
cd digital-student-registration

# 2. Copy environment template
cp .env.docker.example .env

# 3. Edit .env and set required variables
# At minimum, update:
#   - MONGO_PASSWORD
#   - NEXTAUTH_SECRET (generate with: openssl rand -base64 48)
nano .env  # or use your preferred editor

# 4. Start development environment
docker-compose up -d

# 5. View logs
docker-compose logs -f app

# 6. Access the application
# Application: https://localhost:3000
# Mongo Express (DB UI): http://localhost:8081
```

### Production

```bash
# 1. Copy environment template
cp .env.production.template .env.production

# 2. Configure production environment variables
nano .env.production
# CRITICAL: Update all security-sensitive values:
#   - MONGO_PASSWORD (strong random password)
#   - NEXTAUTH_SECRET (64+ character random string)
#   - NEXTAUTH_URL (your domain: https://your-domain.com)
#   - NEXT_PUBLIC_API_URL (your domain: https://your-domain.com)

# 3. Build and start production containers
docker-compose up -d --build

# 4. Check container health
docker-compose ps

# 5. View logs
docker-compose logs -f app

# 6. Set up reverse proxy (nginx/Caddy) for SSL
# See "Reverse Proxy Setup" section below
```

---

## Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.docker.example .env
```

**Critical Variables** (must be configured):

| Variable              | Description                    | Example                                                                        |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `NODE_ENV`            | Environment mode               | `production`                                                                   |
| `MONGODB_URI`         | MongoDB connection string      | `mongodb://admin:pass@mongo:27017/digital-student-onboarding?authSource=admin` |
| `MONGO_USER`          | MongoDB admin username         | `admin`                                                                        |
| `MONGO_PASSWORD`      | MongoDB admin password         | `YourSecurePassword123!`                                                       |
| `NEXTAUTH_URL`        | Application URL                | `https://your-domain.com`                                                      |
| `NEXTAUTH_SECRET`     | JWT signing secret (64+ chars) | `<generated-random-string>`                                                    |
| `NEXT_PUBLIC_API_URL` | Public API URL                 | `https://your-domain.com`                                                      |

**Generate Secure Secrets:**

```bash
# Linux/Mac - Generate NEXTAUTH_SECRET
openssl rand -base64 48

# Node.js - Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Docker Compose Files

- **`docker-compose.yml`**: Production environment (DEFAULT)
  - Full-featured production stack
  - Includes Caddy reverse proxy with automatic HTTPS
  - MongoDB database and Redis caching layer
  - Optimized builds with security hardening
  - Resource limits configured
  - Use `yarn dev` locally for development (no Docker needed)

- **`docker-compose.windows.yml`**: Windows-specific deployment
  - For Docker Desktop on Windows with WSL2
  - Simplified setup without Caddy (direct port exposure)
  - Suitable for local testing on Windows

---

## Docker Architecture

### Services

#### 1. MongoDB (`mongo`)

- **Image**: `mongo:7.0`
- **Purpose**: Database for storing all application data
- **Ports**: 27017 (internal), exposed on localhost only in production
- **Volumes**: Persistent data storage
- **Health Check**: MongoDB ping command

#### 2. Application (`app`)

- **Image**: Custom built from Dockerfile
- **Purpose**: Next.js application server
- **Ports**: 3000 (HTTP)
- **Depends On**: MongoDB
- **Health Check**: `/api/health/full` endpoint

#### 3. Mongo Express (`mongo-express`) - Development Only

- **Image**: `mongo-express:1.0.2`
- **Purpose**: Web-based MongoDB admin interface
- **Ports**: 8081
- **Access**: <http://localhost:8081>
- **Credentials**: Set in `.env` (MONGO_EXPRESS_USER/PASSWORD)

### Volumes

- `mongo_data_dev` / `mongo_data_prod`: MongoDB database files
- `mongo_config_dev` / `mongo_config_prod`: MongoDB configuration

### Networks

- `student_network`: Bridge network connecting all services

---

## Development Setup

### Starting Development Environment

```bash
# Start all services
docker-compose up -d

# Start and view logs
docker-compose up

# Start specific service
docker-compose up -d app
```

### Development Features

1. **Hot Reload**: Code changes are automatically detected
2. **Volume Mounts**: Source code is mounted, no rebuild needed for code changes
3. **HTTPS**: Self-signed certificates in `./certificates/` directory
4. **Mongo Express**: Database viewer at <http://localhost:8081>

### Development Commands

```bash
# View logs
docker-compose logs -f app      # Application logs
docker-compose logs -f mongo    # MongoDB logs

# Restart specific service
docker-compose restart app

# Rebuild after dependency changes
docker-compose up -d --build

# Execute commands in container
docker-compose exec app sh      # Shell access
docker-compose exec app yarn test   # Run tests
docker-compose exec mongo mongosh   # MongoDB shell

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: deletes database)
docker-compose down -v
```

### Accessing Mongo Express

1. Open <http://localhost:8081>
2. Login with credentials from `.env`:
   - Username: `MONGO_EXPRESS_USER` (default: admin)
   - Password: `MONGO_EXPRESS_PASSWORD` (default: pass)
3. Navigate databases and collections
4. Run queries and view data

---

## Production Setup

### Pre-Deployment Checklist

- [ ] Strong MongoDB password set (`MONGO_PASSWORD`)
- [ ] Secure NEXTAUTH_SECRET generated (64+ characters)
- [ ] Correct domain configured (`NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`)
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] Reverse proxy configured (nginx, Caddy, Traefik)
- [ ] Firewall rules configured
- [ ] Backup strategy planned
- [ ] Monitoring configured

### Building for Production

```bash
# Build images without starting
docker-compose build

# Build with no cache (clean build)
docker-compose build --no-cache

# Build and start
docker-compose up -d --build
```

### Production Commands

```bash
# Start production environment
docker-compose up -d

# View logs (detached)
docker-compose logs -f

# Check service health
docker-compose ps

# Update application (after git pull)
docker-compose up -d --build app

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

### Production Health Checks

```bash
# Check container health status
docker ps

# Test health endpoint directly
docker-compose exec app ./docker-healthcheck.sh

# Check MongoDB health
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# View resource usage
docker stats
```

---

## SSL/HTTPS Configuration

### Development (Self-Signed Certificates)

The development setup uses self-signed certificates located in `./certificates/`:

- `localhost.pem` - Certificate
- `localhost-key.pem` - Private key

These are mounted as volumes in `docker-compose.yml`. Browsers will show security warnings (expected for self-signed certs).

### Production (Recommended Approaches)

#### Option 1: Reverse Proxy with SSL Termination (Recommended)

Run the application on HTTP inside Docker and handle SSL with a reverse proxy:

**Advantages**:

- Industry best practice
- Easy certificate management (Let's Encrypt auto-renewal)
- Can handle multiple applications
- Better performance with caching
- DDoS protection

**Recommended Tools**:

- **Caddy**: Automatic HTTPS, easiest setup
- **nginx**: Most popular, highly configurable
- **Traefik**: Docker-native, great for microservices

See [Reverse Proxy Setup](#reverse-proxy-setup) section below.

#### Option 2: Mount SSL Certificates

If you prefer to handle SSL directly in the container:

```yaml
# docker-compose.yml
services:
  app:
    volumes:
      - /path/to/your/ssl/cert.pem:/app/certificates/cert.pem:ro
      - /path/to/your/ssl/key.pem:/app/certificates/key.pem:ro
    environment:
      - SSL_CERT_PATH=/app/certificates/cert.pem
      - SSL_KEY_PATH=/app/certificates/key.pem
```

**Note**: This requires modifying the Next.js server configuration.

---

## Reverse Proxy Setup

### Caddy (Easiest - Recommended)

**Install Caddy**: [caddyserver.com/docs/install](https://caddyserver.com/docs/install)

**Caddyfile**:

```caddy
your-domain.com {
    reverse_proxy localhost:3000

    # Optional: Add security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
    }

    # Optional: Enable compression
    encode gzip
}
```

**Start Caddy**:

```bash
sudo caddy start
```

**Benefits**:

- Automatic HTTPS with Let's Encrypt
- Auto-renewal of certificates
- HTTP/2 and HTTP/3 support
- Zero configuration SSL

### nginx

**Install nginx**: [nginx.org/en/linux_packages.html](http://nginx.org/en/linux_packages.html)

**Configuration** (`/etc/nginx/sites-available/digital-student`):

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy Configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Increase timeouts for long-running requests
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

**Enable and start**:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/digital-student /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

**Obtain SSL Certificates (Let's Encrypt)**:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Traefik (Docker-Native)

**docker-compose.traefik.yml**:

```yaml
version: "3.9"

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: always
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your-email@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-letsencrypt:/letsencrypt
    networks:
      - student_network

  app:
    # ... existing app configuration ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=3000"

volumes:
  traefik-letsencrypt:

networks:
  student_network:
    external: true
```

---

## Maintenance

### Backup and Restore

#### Backup MongoDB Data

```bash
# Using docker-compose
docker-compose exec mongo mongodump \
  --username=admin \
  --password=your-password \
  --authenticationDatabase=admin \
  --db=digital-student-onboarding \
  --out=/data/backup

# Copy backup from container to host
docker cp digital-student-mongo-prod:/data/backup ./backup-$(date +%Y%m%d)

# Alternative: Backup the volume directly
docker run --rm \
  -v digital_student_mongo_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mongo-backup-$(date +%Y%m%d).tar.gz /data
```

#### Restore MongoDB Data

```bash
# Copy backup to container
docker cp ./backup digital-student-mongo-prod:/data/restore

# Restore database
docker-compose exec mongo mongorestore \
  --username=admin \
  --password=your-password \
  --authenticationDatabase=admin \
  --db=digital-student-onboarding \
  /data/restore/digital-student-onboarding

# Alternative: Restore from volume backup
docker run --rm \
  -v digital_student_mongo_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/mongo-backup-20250101.tar.gz -C /
```

### Update Application

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart containers
docker-compose up -d --build app

# 3. Check logs for errors
docker-compose logs -f app

# 4. Verify health
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Since specific time
docker-compose logs --since 2025-01-01T12:00:00

# Export logs to file
docker-compose logs app > app-logs.txt
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes (CAUTION: deletes database)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a

# Remove specific volume
docker volume rm digital_student_mongo_data_prod
```

---

## Troubleshooting

### Container Won't Start

**Check logs**:

```bash
docker-compose logs app
```

**Common issues**:

- Port already in use: Stop other services on ports 3000/27017
- Environment variables not set: Check `.env` file
- MongoDB not ready: Wait for MongoDB health check to pass

### Application Not Accessible

**Verify containers are running**:

```bash
docker-compose ps
```

**Check health status**:

```bash
docker inspect digital-student-app-prod | grep Health -A 10
```

**Test endpoints directly**:

```bash
# Health check
curl http://localhost:3000/api/health/live

# Full health check (including DB)
curl http://localhost:3000/api/health/full
```

### Database Connection Errors

**Check MongoDB is running**:

```bash
docker-compose logs mongo
```

**Test MongoDB connection**:

```bash
docker-compose exec mongo mongosh \
  --username admin \
  --password your-password \
  --authenticationDatabase admin
```

**Verify connection string**:

- Host should be `mongo` (service name), not `localhost`
- Port should be `27017` (internal port)
- Authentication database should be `admin`

### Port Conflicts

**Check what's using the port**:

```bash
# Linux/Mac
sudo lsof -i :3000
sudo lsof -i :27017

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :27017
```

**Change ports** in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Host port 3001 → Container port 3000
```

### Permission Denied Errors

**Fix file permissions**:

```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Make healthcheck script executable
chmod +x docker-healthcheck.sh
```

**Docker daemon not running**:

```bash
# Linux
sudo systemctl start docker

# Mac/Windows
# Start Docker Desktop application
```

### Out of Memory

**Check container memory usage**:

```bash
docker stats
```

**Increase memory limits** in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 4G
```

**Increase Node.js memory**:

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

### SSL/HTTPS Issues

**Development (self-signed certificates)**:

- Browser warnings are expected
- Click "Advanced" → "Proceed to localhost"
- Or import certificate to system trust store

**Production**:

- Verify certificates are valid: `openssl x509 -in cert.pem -text -noout`
- Check certificate expiry: `openssl x509 -in cert.pem -noout -enddate`
- Verify reverse proxy configuration
- Check firewall allows ports 80/443

### Container Exits Immediately

**Check exit code**:

```bash
docker-compose ps
```

**View full logs**:

```bash
docker-compose logs app
```

**Common causes**:

- Missing required environment variables
- Syntax errors in code
- Port already in use
- MongoDB connection failed

**Test manually**:

```bash
docker-compose run --rm app sh
# Inside container:
node server.js
```

---

## Best Practices

### Security

1. **Never commit `.env` file** to version control
2. **Use strong passwords** (20+ characters, random)
3. **Rotate secrets regularly** (every 90 days)
4. **Run containers as non-root** (already configured in Dockerfile)
5. **Keep images updated**: `docker-compose pull && docker-compose up -d`
6. **Limit container resources** (CPU, memory) in production
7. **Use secrets management** for production (Docker Secrets, Vault)
8. **Enable firewall** and expose only necessary ports
9. **Regular security audits**: `docker scan <image>`

### Performance

1. **Use production builds** (`docker-compose.yml`)
2. **Enable caching** in reverse proxy (nginx, Caddy)
3. **Monitor resource usage**: `docker stats`
4. **Set appropriate resource limits**
5. **Use SSD storage** for database volumes
6. **Enable compression** in reverse proxy
7. **Implement CDN** for static assets

### Reliability

1. **Regular backups** (daily recommended)
2. **Test restores** regularly
3. **Monitor logs** for errors
4. **Set up alerts** (Prometheus, Grafana)
5. **Use health checks** (already configured)
6. **Plan disaster recovery** procedures
7. **Document runbooks** for common issues

### Development Process

1. **Use volume mounts** for hot reload
2. **Keep development and production configs separate**
3. **Test with production-like environment** before deploying
4. **Use Docker Compose** for consistent environments
5. **Version control** your Docker configurations

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Let's Encrypt](https://letsencrypt.org/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [nginx Documentation](https://nginx.org/en/docs/)

---

## Support

For application-specific issues, see:

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- [SETUP.md](./SETUP.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

For Docker-specific questions:

- [Docker Community Forums](https://forums.docker.com/)
- [Stack Overflow - Docker Tag](https://stackoverflow.com/questions/tagged/docker)
