# Quick Start for Testers

> **Zero-configuration Docker setup for testing the Digital Student Registration system**

## Prerequisites

- **Docker** version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** version 2.0+ (included with Docker Desktop)
- **Git** (to clone the repository)

**That's it!** No need for Node.js, MongoDB, or any other dependencies.

---

## Start the Application (One Command)

```bash
# Clone the repository
git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration

# Start everything
docker compose up -d
```

**Done!** The application is starting up. Wait ~30 seconds for the services to initialize.

---

## Access the Application

### Main Application

**URL:** [https://localhost:3000](https://localhost:3000)

**First-time setup:**

1. Visit https://localhost:3000/setup
2. Create your admin account (email + password)
3. Save the recovery code (shown only once!)
4. Login at https://localhost:3000/login

**Browser SSL Warning:**

- You'll see a security warning (self-signed certificate)
- This is normal for local testing
- Click "Advanced" → "Proceed to localhost" (Chrome)
- Or "Accept the Risk and Continue" (Firefox)

### MongoDB Admin UI (Mongo Express)

**URL:** [http://localhost:8081](http://localhost:8081)

**Credentials:**

- Username: `admin`
- Password: `pass`

**Use this to:**

- View database contents
- Inspect collections (classes, students, users)
- Debug data issues

---

## Testing Credentials

### Database Access (if needed)

```bash
# Connect to MongoDB from host machine
mongosh "mongodb://admin:test-password-123-NOT-FOR-PRODUCTION@localhost:27017/digital-student-onboarding?authSource=admin"
```

**MongoDB Credentials:**

- Host: `localhost:27017`
- Username: `admin`
- Password: `test-password-123-NOT-FOR-PRODUCTION`
- Database: `digital-student-onboarding`

---

## Common Commands

### View Logs

```bash
# All services
docker compose logs -f

# Just the application
docker compose logs -f app

# Just MongoDB
docker compose logs -f mongo
```

### Check Service Status

```bash
docker compose ps
```

**Expected output:**

```
NAME                            STATUS          PORTS
digital-student-app-dev         Up (healthy)    0.0.0.0:3000->3000/tcp
digital-student-mongo-dev       Up (healthy)    0.0.0.0:27017->27017/tcp
digital-student-mongo-express   Up              0.0.0.0:8081->8081/tcp
```

### Stop the Application

```bash
docker compose down
```

### Stop and Remove All Data

```bash
# WARNING: This deletes the database!
docker compose down -v
```

### Restart After Changes

```bash
docker compose restart
```

### Rebuild Application

```bash
# If you pulled new code changes
docker compose up -d --build
```

---

## Testing Scenarios

### 1. Admin Dashboard

1. Complete setup wizard at `/setup`
2. Login at `/login`
3. Navigate to **Dashboard** (`/admin/dashboard`)
4. Try drag-and-drop widget rearrangement
5. View real-time statistics

### 2. Class Management

1. Go to **Management** → **Classes** (`/admin/management/classes`)
2. Click "Add Class" button
3. Create a new class (e.g., "10A" for grade 10)
4. Edit and delete classes

### 3. Student Onboarding

1. Create a class first (see above)
2. Go to **Management** → **Students** (`/admin/management/students`)
3. Click "Add Student" button
4. Fill in basic info (first name, last name, email)
5. Student receives "invited" status
6. Visit student onboarding: `/student/[studentId]`
7. Complete all 10 steps:
   - Welcome (class selection)
   - General Information
   - Origin
   - Address
   - Parents/Guardians
   - Pre-Education
   - Training (if vocational class)
   - Company Contact (if vocational)
   - Summary
   - Completion
8. Verify student status changes to "onboarded"

### 4. Settings & Integrations

1. Go to **Settings** (`/admin/settings`)
2. Configure onboarding steps (enable/disable)
3. Test audit logs (view all actions)
4. Try integration placeholders

### 5. Data Export

1. Navigate to Classes or Students page
2. Use export buttons:
   - CSV export
   - Excel export
   - PDF export
3. Verify downloaded files

### 6. Internationalization

1. Use language switcher in top navigation
2. Toggle between English and German
3. Verify all pages translate correctly

### 7. Accessibility Features

1. Open accessibility menu (human icon in navigation)
2. Toggle **Dark Mode**
3. Enable **High Contrast Mode**
4. Enable **Dyslexia-Friendly Font** (OpenDyslexic)
5. Test **Keyboard Navigation** (Tab key)

---

## Troubleshooting

### Port Already in Use

If you see "port is already allocated" errors:

```bash
# Check what's using the port
lsof -i :3000    # Application
lsof -i :27017   # MongoDB
lsof -i :8081    # Mongo Express

# Stop conflicting services or change ports in docker-compose.yml
```

### Services Won't Start

```bash
# View detailed logs
docker compose logs

# Try rebuilding
docker compose down
docker compose up -d --build
```

### Database Connection Issues

```bash
# Restart MongoDB
docker compose restart mongo

# Check MongoDB is healthy
docker compose ps mongo

# View MongoDB logs
docker compose logs mongo
```

### Application Shows 500 Error

```bash
# Check app logs
docker compose logs app

# Common causes:
# - MongoDB not ready (wait 30 seconds)
# - Unhealthy services (check: docker compose ps)
```

### SSL Certificate Issues

- Browser warning is expected (self-signed cert)
- Always click "Proceed" or "Accept Risk"
- If you can't proceed, try a different browser
- Certificates are in `./certificates/` directory

### Reset Everything

```bash
# Nuclear option: delete all Docker resources
docker compose down -v
docker system prune -a
docker volume prune

# Start fresh
docker compose up -d --build
```

---

## What's Running?

After `docker compose up -d`, you have:

1. **Next.js Application** (Port 3000)
   - Frontend: React 19 with Material-UI
   - Backend: Next.js API Routes
   - Includes hot-reload for development

2. **MongoDB** (Port 27017)
   - Version 7.0
   - Persistent storage in Docker volume
   - Database: `digital-student-onboarding`

3. **Mongo Express** (Port 8081)
   - Web-based MongoDB admin interface
   - Real-time database inspection

**Resource Usage:**

- ~500 MB RAM (total for all services)
- ~2 GB disk space (including images and volumes)

---

## For Developers

If you want to develop locally (not just test):

```bash
# Install dependencies
yarn install

# Run without Docker (requires local MongoDB)
yarn dev

# Run tests
yarn test              # Unit tests
yarn test:e2e:chromium # E2E tests (fastest)

# Code quality
yarn lint              # ESLint
yarn format            # Prettier
```

See [DOCKER.md](./DOCKER.md) for comprehensive Docker documentation.

---

## Security Notice

⚠️ **This setup uses TEST credentials that are committed to git.**

**Default passwords:**

- MongoDB: `test-password-123-NOT-FOR-PRODUCTION`
- Mongo Express: `pass`

**These are INTENTIONALLY SIMPLE for testing purposes.**

**For production deployment:**

1. Use [DOCKER.md](./DOCKER.md) or [DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)
2. Generate secure passwords with: `openssl rand -base64 32`
3. Configure proper SSL certificates
4. Set up reverse proxy (nginx/Caddy)
5. Enable firewalls and security headers

**Never use test credentials in production!**

---

## Get Help

- **Issues:** [GitHub Issues](https://github.com/bso-hef/digital-student-registration/issues)
- **Documentation:** See `docs/` folder
- **Docker Guide:** [DOCKER.md](./DOCKER.md)
- **Deployment:** [DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)

---

## Quick Reference Card

```bash
# Start
docker compose up -d

# Access
https://localhost:3000      # Application
http://localhost:8081       # MongoDB UI

# Logs
docker compose logs -f

# Stop
docker compose down

# Reset
docker compose down -v && docker compose up -d --build
```

**Happy Testing! 🚀**
