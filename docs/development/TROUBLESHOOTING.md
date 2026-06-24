# Troubleshooting Guide

Common issues and solutions.

## Development Issues

### Port 3000 Already in Use

**Problem:** `Error: listen EADDRINUSE :::3000`

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 yarn dev
```

### SSL Certificate Error

**Problem:** `Error: unable to verify certificate` when running the HTTPS dev server.

The dev server runs `next dev --turbopack --experimental-https`, which
auto-generates a self-signed certificate on first run (no `certificates/`
directory is committed to the repo).

```bash
# The browser warns about the self-signed cert in development — accept it to proceed.

# To force regeneration, delete Next.js' generated certificate cache and restart:
rm -rf node_modules/.next/cache
yarn dev
```

### Module Not Found

**Problem:** `Module not found: '@/components/...'`

```bash
rm -rf node_modules .next
yarn install
```

### Hot Reload Not Working

```bash
# Clear cache
rm -rf .next

# Linux: Increase watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Database Issues

### MongoDB Connection Failed

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Check .env.local
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding
```

### Authentication Failed

```bash
# No auth (development)
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding

# With auth
mongosh
use admin
db.createUser({
  user: "dev_user",
  pwd: "dev_password",
  roles: ["readWrite"]
})
```

### Connection Timeout

```javascript
// src/lib/config/mongo.ts
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 60000,
});
```

### Duplicate Key Error

```bash
mongosh
use digital-student-onboarding
db.classes.find({ name: "10A" })

# Update or drop index
db.classes.updateOne({ _id: ObjectId("...") }, { $set: { name: "10B" } })
```

---

## Build Issues

### TypeScript Errors

```bash
yarn lint
rm -rf .next
yarn build
```

### Out of Memory

```bash
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

### Pages Missing After Build

```bash
rm -rf .next
yarn build

# File names must be lowercase
# ✅ page.tsx
# ❌ Page.tsx
```

---

## Runtime Errors

### Redux Hydration Error

**Problem:** `Warning: Text content did not match`

```typescript
import { useEffect, useState } from "react";

function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <div>...</div>;
}
```

### API Route Returns 404

```bash
# Must be route.ts
# ✅ src/app/api/classes/route.ts
# ❌ src/pages/api/classes.ts

yarn build && yarn start
```

### Environment Variables Not Working

```bash
# Check file exists
ls -la .env.local

# Client-side: NEXT_PUBLIC_*
# Server-side: No prefix

# Restart after changes
yarn dev
```

### Session Lost on Refresh

```typescript
// Check Redux Persist in src/store/store.ts
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "student", "class"],
};
```

---

## Testing Issues

### Vitest Tests Failing

**Problem:** `ReferenceError: window is not defined`

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

### Test Timeouts

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 20000,
  },
});
```

### MSW Not Working

MSW is **not** started for unit tests. `tests/setup.ts` mocks `fetch` directly
because the MSW node server only runs in the Node environment used by
integration tests. The MSW server lifecycle lives in `tests/integration.setup.ts`:

```typescript
// tests/integration.setup.ts
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Performance Issues

### Slow Page Load

```bash
yarn build
yarn analyze

# Use Next.js Image
import Image from "next/image";
```

### High Memory Usage

```bash
# Inspect container resource usage (Docker deployment)
docker stats

# Raise the Node heap limit at build time if the build itself runs out of memory
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

### Slow Database Queries

```javascript
// Create indexes
db.students.createIndex({
  firstNameNorm: 1,
  lastNameNorm: 1,
  dateOfBirth: 1,
});

// Use lean queries
const students = await Student.find().lean();

// Use pagination
const result = await Student.paginate({}, { page: 1, limit: 20 });
```

---

## Deployment Issues

### Build Fails in Production

```bash
# Check Node version
node --version  # v22.20.0

# Install exact versions
yarn install --frozen-lockfile

# Clear and rebuild
rm -rf node_modules .next
yarn install && yarn build
```

> The application is deployed with Docker only (see `docker-compose.yml`,
> `Dockerfile`). There is no PM2, systemd, or nginx configuration in this repo,
> so the commands below use the Docker Compose deployment described in
> [DEPLOYMENT.md](./DEPLOYMENT.md).

### Application Crashes on Start

```bash
# Check container logs
docker compose logs --tail=100 app
docker compose logs -f app

# Confirm environment is wired up
docker compose config | grep environment

# Common causes:
# - Missing env variables (NEXT_PUBLIC_APP_URL, NEXTAUTH_SECRET, etc.)
# - URLs still contain "localhost" (build fails validation in v2.1.0+)
# - MongoDB / Redis containers not healthy
# - Port (APP_PORT) already in use
```

### Container Unhealthy or Not Reachable

```bash
# Check status — app should report "healthy" after ~60s
docker compose ps

# Run the in-container health check
docker compose exec app sh scripts/docker-healthcheck.sh

# Restart the app service
docker compose restart app

# Full recreate
docker compose down && docker compose --profile linux up -d
```

### QR Codes / URLs Show localhost

`NEXT_PUBLIC_*` URLs are embedded at **build time**. Changing them requires a
rebuild — restarting the container is not enough.

```bash
export NEXT_PUBLIC_APP_URL=https://your-domain.com
export NEXT_PUBLIC_API_URL=https://your-domain.com

# Rebuild the image, then redeploy
./scripts/docker-build.sh --no-cache
docker compose down && docker compose --profile linux up -d
```

---

## Common Error Messages

### "Module not found"

**Fix:** Check TypeScript path aliases in `tsconfig.json`

### "EADDRINUSE"

**Fix:** Kill process on port 3000

### "Cannot read property 'x' of undefined"

**Fix:** Use optional chaining

```typescript
// ✅ Good
const name = user?.profile?.name || "Unknown";

// ❌ Bad
const name = user.profile.name;
```

### "Hydration failed"

**Fix:** Ensure server and client render same content

---

## Getting Help

### Check Logs

- Application (Docker): `docker compose logs -f app`
- MongoDB / Redis containers: `docker compose logs mongo` / `docker compose logs redis`
- Browser: F12 → Console

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Material-UI Docs](https://mui.com/)

### Reporting Issues

Provide:

- Full error message with stack trace
- Steps to reproduce
- Environment details (OS, Node version)
- Relevant logs

---

## Prevention Tips

```bash
# Keep dependencies updated
yarn outdated
yarn upgrade-interactive

# Test before deploying
yarn test:unit
yarn build
```

**Best practices:**

- Regular database backups
- Monitor logs with alerts
- Commit frequently with meaningful messages
- Never commit secrets
