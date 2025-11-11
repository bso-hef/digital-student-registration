# Deployment Guide

Production deployment guide for the Digital Student Registration application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [MongoDB Setup](#mongodb-setup)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Production Server](#production-server)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [Process Management](#process-management)
- [Monitoring](#monitoring)
- [Backup Strategy](#backup-strategy)
- [Performance Optimization](#performance-optimization)

---

## Prerequisites

### System Requirements

- **Node.js**: v22.20.0 (exactly, as specified in package.json engines)
- **Yarn**: 1.22.22
- **MongoDB**: 7.0 or higher
- **Operating System**: Linux (Ubuntu 22.04 recommended) or Windows Server
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 10GB free space

### Software Dependencies

```bash
# Update system packages (Ubuntu)
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn@1.22.22

# Install MongoDB (Ubuntu)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production` or set environment variables:

```env
# Application Environment
NODE_ENV=production

# Application URLs
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_NAME=digital-student-registration

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/digital-student-production
MONGO_USER=production_user
MONGO_PASSWORD=secure_password_here

# Optional: If using MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Logging
LOG_LEVEL=info

# Security (future)
# JWT_SECRET=your-secret-key-here
# SESSION_SECRET=another-secret-key
```

### Environment File Security

**Never commit production `.env` files to version control!**

```bash
# Ensure .env files are in .gitignore
echo ".env.production" >> .gitignore
echo ".env.local" >> .gitignore
```

### Setting Environment Variables on Server

**Option 1: Using systemd (recommended)**

```ini
# /etc/systemd/system/digital-student-registration.service
[Service]
Environment="NODE_ENV=production"
Environment="MONGODB_URI=mongodb://localhost:27017/digital-student-production"
Environment="NEXT_PUBLIC_API_URL=https://your-domain.com"
```

**Option 2: Using shell profile**

```bash
# Add to /etc/environment or ~/.bashrc
export NODE_ENV=production
export MONGODB_URI="mongodb://localhost:27017/digital-student-production"
export NEXT_PUBLIC_API_URL="https://your-domain.com"
```

---

## Build Process

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration
```

### 2. Install Dependencies

```bash
yarn install --frozen-lockfile --production=false
```

### 3. Build Application

```bash
yarn build
```

This creates an optimized production build in `.next/` directory.

### Build Output

```
.next/
├── cache/                  # Build cache
├── server/                 # Server-side code
├── static/                 # Static assets
└── standalone/             # (if using output: 'standalone')
```

### 4. Verify Build

```bash
# Check build was successful
ls -la .next/

# Test production build locally
yarn start
```

---

## MongoDB Setup

### Production Database Configuration

#### 1. Create Database and User

```javascript
// Connect to MongoDB shell
mongosh

// Switch to admin database
use admin

// Create database user
db.createUser({
  user: "production_user",
  pwd: "secure_password_here",
  roles: [
    {
      role: "readWrite",
      db: "digital-student-production"
    }
  ]
})

// Switch to application database
use digital-student-production

// Verify connection
db.auth("production_user", "secure_password_here")
```

#### 2. Enable Authentication

Edit MongoDB configuration:

```bash
sudo nano /etc/mongod.conf
```

```yaml
# /etc/mongod.conf
security:
  authorization: enabled

net:
  port: 27017
  bindIp: 127.0.0.1 # Only local connections
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
sudo systemctl enable mongod  # Start on boot
```

#### 3. Verify Connection

```bash
mongosh "mongodb://production_user:secure_password_here@localhost:27017/digital-student-production"
```

### MongoDB Atlas (Cloud Alternative)

If using MongoDB Atlas:

1. Create cluster at mongodb.com
2. Whitelist your server IP
3. Get connection string
4. Update `MONGODB_URI` environment variable

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-student-production?retryWrites=true&w=majority
```

---

## SSL/TLS Configuration

### Development SSL Certificates

Development uses self-signed certificates in `./certificates/`.

### Production SSL with Let's Encrypt

#### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Obtain Certificate

```bash
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

#### 3. Certificate Locations

```
/etc/letsencrypt/live/your-domain.com/
├── fullchain.pem   # SSL certificate
├── privkey.pem     # Private key
├── cert.pem        # Certificate only
└── chain.pem       # Chain certificates
```

#### 4. Auto-Renewal

Certbot automatically creates renewal cron job:

```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

---

## Production Server

### Start Production Server

#### Option 1: Direct Start

```bash
cd /var/www/digital-student-registration
yarn start
```

Server runs on port 3000 by default.

#### Option 2: Custom Port

```bash
PORT=8080 yarn start
```

### Server Configuration

Next.js production server automatically uses:

- Optimized production bundles
- Server-side rendering (SSR)
- API route handling
- Static file serving

---

## Reverse Proxy Setup

### Nginx Configuration

#### 1. Install Nginx

```bash
sudo apt install nginx -y
```

#### 2. Create Site Configuration

```bash
sudo nano /etc/nginx/sites-available/digital-student-registration
```

```nginx
# /etc/nginx/sites-available/digital-student-registration

upstream nextjs_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

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
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/digital-student-registration-access.log;
    error_log /var/log/nginx/digital-student-registration-error.log;

    # Gzip Compression
    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
    gzip_vary on;

    # Proxy Settings
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Files (Next.js serves these, but we can cache them)
    location /_next/static/ {
        proxy_pass http://nextjs_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Public Static Files
    location /static/ {
        proxy_pass http://nextjs_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Health Check Endpoint
    location /api/health/live {
        proxy_pass http://nextjs_backend;
        access_log off;
    }

    # Rate Limiting for API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://nextjs_backend;
    }
}

# Rate Limit Zone (add to http block in /etc/nginx/nginx.conf)
# limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

#### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/digital-student-registration /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
sudo systemctl enable nginx  # Start on boot
```

---

## Process Management

### Using PM2 (Recommended)

#### 1. Install PM2

```bash
sudo npm install -g pm2
```

#### 2. Create PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "digital-student-registration",
      cwd: "/var/www/digital-student-registration",
      script: "yarn",
      args: "start",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
```

#### 3. Start Application

```bash
cd /var/www/digital-student-registration
pm2 start ecosystem.config.js
pm2 save  # Save process list
pm2 startup  # Generate startup script
```

#### 4. PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs digital-student-registration

# Restart
pm2 restart digital-student-registration

# Stop
pm2 stop digital-student-registration

# Delete
pm2 delete digital-student-registration

# Monitor
pm2 monit
```

### Using Systemd

Create systemd service file:

```bash
sudo nano /etc/systemd/system/digital-student-registration.service
```

```ini
[Unit]
Description=Digital Student Registration
After=network.target mongodb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/digital-student-registration
Environment="NODE_ENV=production"
Environment="MONGODB_URI=mongodb://localhost:27017/digital-student-production"
Environment="NEXT_PUBLIC_API_URL=https://your-domain.com"
ExecStart=/usr/bin/yarn start
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/digital-student-registration/output.log
StandardError=append:/var/log/digital-student-registration/error.log

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo mkdir -p /var/log/digital-student-registration
sudo systemctl daemon-reload
sudo systemctl enable digital-student-registration
sudo systemctl start digital-student-registration
sudo systemctl status digital-student-registration
```

---

## Monitoring

### Application Health Checks

Use health endpoints:

```bash
# Liveness check
curl https://your-domain.com/api/health/live

# Full health check
curl https://your-domain.com/api/health/full
```

### Log Monitoring

```bash
# PM2 logs
pm2 logs digital-student-registration --lines 100

# Systemd logs
sudo journalctl -u digital-student-registration -f

# Nginx logs
sudo tail -f /var/log/nginx/digital-student-registration-access.log
sudo tail -f /var/log/nginx/digital-student-registration-error.log
```

### Monitoring Tools

**Basic monitoring script:**

```bash
#!/bin/bash
# /usr/local/bin/health-check.sh

HEALTH_URL="https://your-domain.com/api/health/live"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Health check failed with status $RESPONSE"
    # Restart service
    pm2 restart digital-student-registration
    # Or: sudo systemctl restart digital-student-registration
fi
```

Add to cron:

```bash
# Run health check every 5 minutes
*/5 * * * * /usr/local/bin/health-check.sh
```

---

## Backup Strategy

### Database Backups

#### Automated MongoDB Backup Script

```bash
#!/bin/bash
# /usr/local/bin/mongo-backup.sh

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/mongodb"
DB_NAME="digital-student-production"

mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://production_user:secure_password_here@localhost:27017/$DB_NAME" \
    --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" "$BACKUP_DIR/backup_$TIMESTAMP"
rm -rf "$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.tar.gz"
```

Make executable and add to cron:

```bash
chmod +x /usr/local/bin/mongo-backup.sh

# Daily backup at 2 AM
crontab -e
0 2 * * * /usr/local/bin/mongo-backup.sh
```

#### Restore from Backup

```bash
tar -xzf /var/backups/mongodb/backup_20241026_020000.tar.gz
mongorestore --uri="mongodb://production_user:secure_password_here@localhost:27017/$DB_NAME" backup_20241026_020000/
```

### Application Backups

```bash
# Backup application files
tar -czf /var/backups/app_$(date +%Y%m%d).tar.gz \
    /var/www/digital-student-registration \
    --exclude=node_modules \
    --exclude=.next
```

---

## Performance Optimization

### Next.js Production Optimizations

Next.js automatically applies these in production:

- Code minification
- Image optimization
- Static page generation
- Automatic code splitting
- Compression

### MongoDB Optimizations

```javascript
// Create indexes for better query performance
db.students.createIndex({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });
db.students.createIndex(
  { currentClass: 1 },
  { partialFilterExpression: { active: true } },
);
db.classes.createIndex(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true },
);
```

### Nginx Caching

Already configured in the Nginx example above:

- Static file caching
- Gzip compression
- HTTP/2 support

### Node.js Performance

Increase Node.js memory limit if needed:

```bash
NODE_OPTIONS="--max-old-space-size=4096" yarn start
```

---

## Security Checklist

- [ ] Environment variables secured (not in version control)
- [ ] MongoDB authentication enabled
- [ ] SSL/TLS certificates configured
- [ ] Nginx security headers enabled
- [ ] Rate limiting configured
- [ ] Firewall rules configured (UFW or iptables)
- [ ] Regular security updates applied
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Logs rotated and archived

---

## Deployment Checklist

- [ ] Node.js v22.20.0 installed
- [ ] Yarn 1.22.22 installed
- [ ] MongoDB configured and running
- [ ] Application cloned and dependencies installed
- [ ] Production build completed successfully
- [ ] Environment variables configured
- [ ] SSL certificates obtained and configured
- [ ] Nginx configured and tested
- [ ] Process manager (PM2/systemd) configured
- [ ] Application started and accessible
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Documentation updated with server details

---

## Troubleshooting Deployment Issues

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common deployment issues and solutions.
