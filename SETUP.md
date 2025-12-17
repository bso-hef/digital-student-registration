# Quick Setup Guide

Choose your deployment mode and follow the instructions below.

---

## 1. Local Development (localhost)

**For:** Quick testing on localhost/127.0.0.1
**Requirements:** Docker, Docker Compose

### Setup (3 steps)

```bash
# 1. Copy environment
cp .env.docker.example .env

# 2. Start development environment
docker-compose up -d

# 3. Open browser
open https://localhost:3000
# Note: Accept browser security warning (self-signed certificate)
```

**Access:**

- App: https://localhost:3000 (self-signed cert - accept browser warning)
- Mongo Express: http://localhost:8081 (admin/admin123)
- MongoDB: mongodb://admin:admin123@localhost:27017

**Commands:**

```bash
# Logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 2. Production (Linux Server)

**For:** Public deployment with domain + SSL
**Requirements:** Docker, Domain, Ports 80/443 open

### Setup (4 steps)

```bash
# 1. Configure environment
cp .env.production.template .env.production
nano .env.production  # Set DOMAIN and ACME_EMAIL

# 2. Configure DNS
# Point your domain A record to server IP

# 3. Run start script
./scripts/start.sh

# 4. Complete setup wizard
# Visit https://your-domain.com/setup
```

**Access:**

- App: https://your-domain.com
- Admin: https://your-domain.com/login

**Commands:**

```bash
# Logs
docker-compose logs -f

# Stop
docker-compose down
```

**See:** [DEPLOYMENT.md](./DEPLOYMENT.md) for full production guide

---

## 3. Windows Container

**For:** Windows Server 2022 or Windows 10/11 Pro
**Requirements:** Docker Desktop (Windows mode), Hyper-V

### Prerequisites

1. **Switch Docker to Windows containers:**
   - Right-click Docker Desktop icon
   - Click "Switch to Windows containers"
   - Wait for restart

2. **Enable Hyper-V (if not enabled):**
   ```powershell
   # Run as Administrator
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   # Restart required
   ```

### Setup (3 steps)

```powershell
# 1. Copy environment
copy .env.windows.template .env.windows

# 2. Run start script (PowerShell as Administrator)
.\scripts\start-windows.ps1

# 3. Open browser
start http://localhost:3000
```

**Access:**

- App: http://localhost:3000
- MongoDB: mongodb://admin:admin123@localhost:27017

**Commands:**

```powershell
# Logs
docker-compose -f docker-compose.windows.yml logs -f app

# Stop
docker-compose -f docker-compose.windows.yml down
```

---

## Troubleshooting

### "Docker is not running"

→ Start Docker Desktop

### "Your connection is not private" (localhost HTTPS)

→ This is normal for self-signed certificates
→ Click "Advanced" → "Proceed to localhost (unsafe)" or similar
→ The connection is encrypted, just not verified by a certificate authority

### "Port already in use"

→ Stop conflicting service or change port in docker-compose file

### "Permission denied" (scripts)

→ Make script executable: `chmod +x scripts/*.sh`

### Windows: "Cannot switch to Windows containers"

→ Enable Hyper-V: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All`

---

## Next Steps

1. Visit application URL
2. Complete setup wizard at `/setup`
3. Create admin account
4. **Save recovery code securely!**
5. Login at `/login`

---

## Documentation

- **DEPLOYMENT.md** - Full production deployment guide
- **DOCKER.md** - Docker configuration details
- **CLAUDE.md** - Development guide
