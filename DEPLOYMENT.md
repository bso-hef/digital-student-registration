# Production Deployment Guide

Complete guide for deploying Digital Student Registration to production using Docker Compose.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Domain & DNS Configuration](#domain--dns-configuration)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Backup & Restore](#backup--restore)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Quick Start

For experienced users, here's the fastest way to deploy:

```bash
# 1. Clone repository
git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration

# 2. Configure environment
cp .env.production.template .env.production
nano .env.production  # Set DOMAIN and ACME_EMAIL

# 3. Deploy
./scripts/start.sh

# 4. Visit your domain
open https://your-domain.com
```

That's it! The script handles everything automatically.

---

## Prerequisites

### Hardware Requirements

**Minimum:**

- 2 CPU cores
- 4 GB RAM
- 20 GB disk space
- 1 Gbps network

**Recommended:**

- 4 CPU cores
- 8 GB RAM
- 50 GB SSD
- 1 Gbps network

### Software Requirements

1. **Operating System:**
   - Ubuntu 22.04 LTS (recommended)
   - Debian 11+
   - CentOS 8+
   - Any Linux with Docker support

2. **Docker:**
   - Docker Engine 24.0+
   - Docker Compose 2.0+

3. **Domain:**
   - A registered domain name
   - Access to DNS settings

4. **Firewall:**
   - Ports 80 (HTTP) and 443 (HTTPS) accessible from internet

### Install Docker

If Docker is not installed:

**Ubuntu/Debian:**

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

**CentOS/RHEL:**

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Server Setup

### 1. Update System

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 2. Configure Firewall

**Using UFW (Ubuntu):**

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

**Using firewalld (CentOS):**

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. Set System Limits

For production workloads, increase system limits:

```bash
# Edit limits configuration
sudo nano /etc/security/limits.conf

# Add these lines:
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536

# Apply immediately
sudo sysctl -w fs.file-max=65536
```

### 4. Optimize Docker

Create Docker daemon configuration:

```bash
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```

Add this configuration:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "userland-proxy": false
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

---

## Domain & DNS Configuration

### 1. Choose Your Domain

You need a domain name pointing to your server. You can use:

- Root domain: `example.com`
- Subdomain: `student-registration.example.com` (recommended)

### 2. Configure DNS

Add an A record in your DNS provider:

| Type | Name             | Value          | TTL |
| ---- | ---------------- | -------------- | --- |
| A    | @ (or subdomain) | Your server IP | 300 |

**Example (Cloudflare, Namecheap, GoDaddy):**

- **Type:** A
- **Name:** `student-registration` (or `@` for root)
- **Value:** `203.0.113.42` (your server IP)
- **TTL:** 300 (5 minutes)

### 3. Verify DNS

Wait a few minutes for DNS propagation, then test:

```bash
# Check DNS resolution
dig +short your-domain.com

# Should return your server IP
```

Or use online tools:

- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## Deployment Steps

### Step 1: Clone Repository

```bash
# Clone to your preferred location
cd /opt
sudo git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration

# Set ownership (if needed)
sudo chown -R $USER:$USER .
```

### Step 2: Configure Environment

```bash
# Copy template
cp .env.production.template .env.production

# Edit configuration
nano .env.production
```

**Required Configuration:**

```bash
# Your domain (REQUIRED)
DOMAIN=student-registration.example.com

# Email for Let's Encrypt (REQUIRED)
ACME_EMAIL=admin@example.com

# Database credentials (will be auto-generated if not set)
MONGO_USER=admin
MONGO_PASSWORD=  # Leave empty for auto-generation
MONGO_DB=digital-student-registration

# Redis password (will be auto-generated if not set)
REDIS_PASSWORD=  # Leave empty for auto-generation

# NextAuth secret (will be auto-generated if not set)
NEXTAUTH_SECRET=  # Leave empty for auto-generation
```

**Save and exit** (Ctrl+X, Y, Enter in nano)

### Step 3: Run Deployment Script

```bash
# Make script executable
chmod +x scripts/start.sh

# Run deployment
./scripts/start.sh
```

The script will:

1. ✅ Check prerequisites (Docker, Docker Compose, etc.)
2. ✅ Validate environment configuration
3. ✅ Auto-generate missing secrets
4. ✅ Check DNS configuration
5. ✅ Check port availability
6. ✅ Build Docker images
7. ✅ Start all services
8. ✅ Obtain SSL certificate from Let's Encrypt
9. ✅ Wait for health checks
10. ✅ Display access information

**Expected output:**

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        Digital Student Registration System                ║
║        Production Deployment Script                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

[INFO] Checking prerequisites...
[SUCCESS] docker is installed
[SUCCESS] docker-compose is installed
[SUCCESS] openssl is installed
[SUCCESS] Docker daemon is running

...

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  Deployment Successful!                                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

  Application URL:  https://student-registration.example.com
  Admin Login:      https://student-registration.example.com/login
  Health Check:     https://student-registration.example.com/api/health/live
```

### Step 4: Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Expected output:
# NAME         IMAGE                                    STATUS
# dsr-caddy    caddy:2.9-alpine                         Up (healthy)
# dsr-app      digital-student-registration:production  Up (healthy)
# dsr-mongo    mongo:7.0                                Up (healthy)
# dsr-redis    redis:7-alpine                           Up (healthy)
```

---

## Post-Deployment

### 1. Initial Setup

Visit your domain: `https://your-domain.com`

You'll be redirected to the setup wizard at `/setup`

1. **Create Admin Account:**
   - Enter admin email
   - Create strong password (min 8 chars, uppercase, lowercase, number)

2. **Save Recovery Code:**
   - A 16-character recovery code is displayed **once**
   - Save it securely (password manager, encrypted file, etc.)
   - Required for password reset

3. **Complete Setup:**
   - Review system configuration
   - Click "Complete Setup"

### 2. Login

Visit: `https://your-domain.com/login`

Use your admin credentials to log in.

### 3. Configure Application

Navigate to `/admin/settings` to configure:

- Onboarding workflow
- Audit logging
- Integration settings

---

## Monitoring & Maintenance

### View Logs

**All services:**

```bash
docker-compose logs -f
```

**Specific service:**

```bash
docker-compose logs -f app
docker-compose logs -f caddy
docker-compose logs -f mongo
docker-compose logs -f redis
```

**Last 100 lines:**

```bash
docker-compose logs --tail=100 app
```

### Check Status

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Disk usage
docker system df
```

### Health Checks

```bash
# Application health
curl https://your-domain.com/api/health/live

# Expected: {"status":"up"}

# Full health (requires authentication)
curl https://your-domain.com/api/health/full
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d --force-recreate

# Check logs
docker-compose logs -f app
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Stop Services

```bash
# Stop all (keeps data)
docker-compose down

# Stop and remove volumes (WARNING: deletes data!)
docker-compose down -v
```

---

## Backup & Restore

### Automated Backup Script

Create a backup script:

```bash
nano /opt/backup-dsr.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/dsr"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec dsr-mongo mongodump \
  --username admin \
  --password "$MONGO_PASSWORD" \
  --authenticationDatabase admin \
  --archive=/tmp/mongo-backup-$DATE.archive \
  --gzip

docker cp dsr-mongo:/tmp/mongo-backup-$DATE.archive $BACKUP_DIR/

# Backup Redis (optional)
docker exec dsr-redis redis-cli --rdb /data/dump.rdb SAVE
docker cp dsr-redis:/data/dump.rdb $BACKUP_DIR/redis-backup-$DATE.rdb

# Backup Caddy certificates
docker cp dsr-caddy:/data/caddy/certificates $BACKUP_DIR/caddy-certs-$DATE

# Backup .env.production
cp .env.production $BACKUP_DIR/env-backup-$DATE

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
```

Make executable:

```bash
chmod +x /opt/backup-dsr.sh
```

**Schedule daily backups:**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/backup-dsr.sh >> /var/log/dsr-backup.log 2>&1
```

### Manual Backup

**MongoDB:**

```bash
docker exec dsr-mongo mongodump \
  --archive=/tmp/backup.archive \
  --gzip

docker cp dsr-mongo:/tmp/backup.archive ./mongo-backup-$(date +%Y%m%d).archive
```

**Redis:**

```bash
docker exec dsr-redis redis-cli SAVE
docker cp dsr-redis:/data/dump.rdb ./redis-backup-$(date +%Y%m%d).rdb
```

### Restore

**MongoDB:**

```bash
# Copy backup to container
docker cp ./mongo-backup.archive dsr-mongo:/tmp/

# Restore
docker exec dsr-mongo mongorestore \
  --archive=/tmp/mongo-backup.archive \
  --gzip \
  --drop
```

**Redis:**

```bash
# Stop Redis
docker-compose stop redis

# Copy backup
docker cp ./redis-backup.rdb dsr-redis:/data/dump.rdb

# Start Redis
docker-compose start redis
```

---

## Scaling

### Horizontal Scaling (Multiple App Containers)

```bash
# Scale to 3 app containers
docker-compose up -d --scale app=3
```

Caddy will automatically load balance between containers.

### Vertical Scaling (More Resources)

Edit `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "4" # Increase from 2
          memory: 4G # Increase from 2G
```

Restart:

```bash
docker-compose up -d
```

---

## Troubleshooting

### SSL Certificate Issues

**Problem:** Let's Encrypt certificate not obtained

**Solutions:**

1. **Check DNS:**

   ```bash
   dig +short your-domain.com
   # Must return your server IP
   ```

2. **Check ports:**

   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   # Ports must be accessible
   ```

3. **Check Caddy logs:**

   ```bash
   docker-compose logs caddy
   # Look for ACME errors
   ```

4. **Use Let's Encrypt staging (for testing):**

   Edit `Caddyfile`, uncomment:

   ```
   acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
   ```

5. **Rate limits:**

   Let's Encrypt has rate limits (50 certs/domain/week). If hit, wait or use staging.

### Service Won't Start

**Check logs:**

```bash
docker-compose logs [service]
```

**Common issues:**

1. **Port conflict:**

   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   # Kill conflicting processes
   ```

2. **Disk space:**

   ```bash
   df -h
   # Ensure >10% free space
   ```

3. **Memory:**
   ```bash
   free -h
   # Ensure sufficient RAM
   ```

### Database Connection Failed

**Check MongoDB:**

```bash
docker exec -it dsr-mongo mongosh -u admin -p
# Enter password from .env.production
```

**Check credentials:**

```bash
grep MONGO_ .env.production
# Verify credentials are correct
```

### Redis Connection Failed

**Check Redis:**

```bash
docker exec -it dsr-redis redis-cli
auth your-redis-password
ping
# Should return PONG
```

### High Resource Usage

**Check resource usage:**

```bash
docker stats
```

**Solutions:**

1. **Increase limits** in `docker-compose.yml`
2. **Scale horizontally** (multiple containers)
3. **Upgrade server** (more RAM/CPU)
4. **Optimize queries** (add database indexes)

### 502 Bad Gateway

**Causes:**

- App container not ready
- App crashed
- Health check failing

**Solutions:**

1. **Check app logs:**

   ```bash
   docker-compose logs app
   ```

2. **Check app health:**

   ```bash
   docker exec dsr-app ./scripts/docker-healthcheck.sh
   ```

3. **Restart app:**
   ```bash
   docker-compose restart app
   ```

---

## Security Best Practices

### 1. Strong Passwords

- Use auto-generated secrets (recommended)
- Minimum 32 characters for database passwords
- 64 characters for NEXTAUTH_SECRET

### 2. Firewall

- Only open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Use `fail2ban` to prevent brute force attacks

### 3. SSH Hardening

```bash
# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 4. Keep Updated

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 5. Regular Backups

- Schedule daily automated backups
- Test restore procedure monthly
- Store backups off-site (S3, Backblaze, etc.)

### 6. Monitoring

Consider adding:

- Uptime monitoring (UptimeRobot, Pingdom)
- Log aggregation (Loki, ELK)
- Metrics (Prometheus, Grafana)

### 7. Audit Logs

Enable audit logging in application settings:

- `/admin/settings` → Audit Logs → Enable

Review logs regularly for suspicious activity.

---

## Performance Optimization

### 1. Database Indexes

MongoDB indexes are pre-configured, but you can add custom indexes:

```bash
docker exec -it dsr-mongo mongosh -u admin -p
use digital-student-registration

# Example: Index on email for faster lookups
db.students.createIndex({ email: 1 })
```

### 2. Redis Caching

The application automatically caches:

- Dashboard statistics (5 minutes)
- Student lists (1 minute)
- Class lists (1 minute)

Adjust cache TTLs in `src/lib/redis.ts` if needed.

### 3. Static Asset Caching

Caddy automatically caches static assets for 1 year. No action needed.

### 4. Compression

Caddy uses Zstandard compression (better than gzip). Enabled by default.

### 5. HTTP/2 & HTTP/3

Enabled by default in Caddy for maximum performance.

---

## Support

### Documentation

- **CLAUDE.md** - Development guide
- **DOCKER.md** - Docker configuration details
- **README.md** - Project overview

### Community

- **GitHub Issues:** https://github.com/bso-hef/digital-student-registration/issues
- **Discussions:** https://github.com/bso-hef/digital-student-registration/discussions

### Professional Support

Contact your system administrator or DevOps team for production support.

---

## License

This project is licensed under the terms specified in the LICENSE file.

---

**Happy Deploying! 🚀**
