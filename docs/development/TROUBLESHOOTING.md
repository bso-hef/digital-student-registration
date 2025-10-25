# Troubleshooting Guide

Common issues and solutions for the Digital Student Registration application.

## Table of Contents

- [Development Issues](#development-issues)
- [Database Issues](#database-issues)
- [Build Issues](#build-issues)
- [Runtime Errors](#runtime-errors)
- [Testing Issues](#testing-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)

---

## Development Issues

### Port 3000 Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**

```bash
# Option 1: Kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Kill process using port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Option 3: Use different port
PORT=3001 yarn dev
```

### SSL Certificate Error in Development

**Problem:** `Error: unable to verify the first certificate`

**Solutions:**

```bash
# Option 1: Use development certificates (recommended)
yarn dev  # Uses certificates in ./certificates/

# Option 2: Disable SSL in development (not recommended)
# Edit package.json: "dev": "next dev --turbopack"
```

### Module Not Found Errors

**Problem:** `Module not found: Can't resolve '@/components/...'`

**Solutions:**

```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules .next
yarn install

# Solution 2: Verify tsconfig.json paths
cat tsconfig.json | grep paths

# Should show:
# "paths": {
#   "@/*": ["./src/*"]
# }
```

### Hot Reload Not Working

**Problem:** Changes not reflecting in browser

**Solutions:**

```bash
# Solution 1: Clear Next.js cache
rm -rf .next

# Solution 2: Restart dev server
# Ctrl+C, then yarn dev

# Solution 3: Check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Database Issues

### MongoDB Connection Failed

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl status mongod
sudo systemctl start mongod

# Verify connection string in .env.local
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding
```

### Authentication Failed

**Problem:** `MongoError: Authentication failed.`

**Solutions:**

```bash
# Option 1: Connect without auth in development
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding

# Option 2: Create user and update connection string
mongosh
use admin
db.createUser({
  user: "dev_user",
  pwd: "dev_password",
  roles: ["readWrite"]
})

# Update .env.local
MONGODB_URI=mongodb://dev_user:dev_password@localhost:27017/digital-student-onboarding
```

### Database Connection Timeout

**Problem:** `MongooseTimeoutError: Server selection timed out after 30000 ms`

**Solutions:**

```javascript
// Increase timeout in src/lib/config/mongo.ts
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 60000, // Increase to 60 seconds
});
```

### Duplicate Key Error

**Problem:** `MongoServerError: E11000 duplicate key error`

**Solutions:**

```bash
# Find duplicate data
mongosh
use digital-student-onboarding
db.classes.find({ name: "10A" })

# Option 1: Update duplicate records
db.classes.updateOne(
  { _id: ObjectId("...") },
  { $set: { name: "10B" } }
)

# Option 2: Drop and recreate index
db.classes.dropIndex("schoolYearFrom_1_schoolYearTo_1_name_1")
db.classes.createIndex(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true }
)
```

---

## Build Issues

### Build Fails with TypeScript Errors

**Problem:** `Type error: Property 'x' does not exist on type 'Y'`

**Solutions:**

```bash
# Solution 1: Fix TypeScript errors
yarn lint
# Fix reported errors

# Solution 2: Check tsconfig.json
cat tsconfig.json

# Solution 3: Clear TypeScript cache
rm -rf .next
yarn build
```

### Out of Memory During Build

**Problem:** `JavaScript heap out of memory`

**Solutions:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" yarn build

# Or add to package.json:
# "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Build Succeeds But Pages Are Missing

**Problem:** 404 errors for pages that exist

**Solutions:**

```bash
# Clear build cache
rm -rf .next
yarn build

# Check file names (must be lowercase)
# ✅ page.tsx
# ❌ Page.tsx

# Verify route structure
ls -R src/app
```

---

## Runtime Errors

### Redux Hydration Error

**Problem:** `Warning: Text content did not match. Server: "..." Client: "..."`

**Solutions:**

```typescript
// Ensure Redux Persist is properly configured
// src/store/store.ts should have:
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Check for client-only rendering in components
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

**Problem:** API endpoints return 404 in production

**Solutions:**

```bash
# Verify API route file naming
# Must be: route.ts (not handler.ts or api.ts)

# Check file location
# ✅ src/app/api/classes/route.ts
# ❌ src/pages/api/classes.ts (old Pages Router)

# Rebuild application
yarn build
yarn start
```

### Environment Variables Not Working

**Problem:** `process.env.MONGODB_URI` is undefined

**Solutions:**

```bash
# Check .env.local exists
ls -la .env.local

# Verify variable names start with NEXT_PUBLIC_ for client-side
# Client-side: NEXT_PUBLIC_API_URL
# Server-side: MONGODB_URI

# Restart dev server after changing .env
# Ctrl+C
yarn dev
```

### Session/Cookie Issues

**Problem:** User session lost on refresh

**Solutions:**

```typescript
// Check Redux Persist configuration
// src/store/store.ts
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "student", "class"], // Ensure these are persisted
};

// Clear browser storage and test
// Chrome DevTools → Application → Clear storage
```

---

## Testing Issues

### Vitest Tests Failing

**Problem:** Tests fail with `ReferenceError: window is not defined`

**Solutions:**

```typescript
// vitest.config.ts should have:
export default defineConfig({
  test: {
    environment: "happy-dom", // or 'jsdom'
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

### Playwright Browser Not Found

**Problem:** `Error: browserType.launch: Executable doesn't exist`

**Solutions:**

```bash
# Install Playwright browsers
yarn playwright:install

# Or install specific browser
npx playwright install chromium

# With dependencies (Linux)
npx playwright install --with-deps chromium
```

### Test Timeouts

**Problem:** `Test timeout of 5000ms exceeded`

**Solutions:**

```typescript
// Increase timeout in vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 20000, // 20 seconds
  },
});

// Or in specific test
test("slow operation", async () => {
  // ...
}, 30000); // 30 second timeout
```

### Mock Service Worker Not Working

**Problem:** API calls not being intercepted

**Solutions:**

```typescript
// Ensure MSW server is started in setup
// tests/setup.ts
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Performance Issues

### Slow Page Load Times

**Problem:** Pages take too long to load

**Solutions:**

```bash
# Build and analyze bundle
yarn build
yarn analyze

# Optimize images
# Use Next.js Image component
import Image from "next/image";

# Enable compression in production
# Already configured in nginx setup
```

### High Memory Usage

**Problem:** Node.js process using too much memory

**Solutions:**

```bash
# Monitor memory usage
# PM2:
pm2 monit

# Systemd:
systemctl status digital-student-registration

# Increase memory limit if needed
NODE_OPTIONS="--max-old-space-size=4096" yarn start

# Check for memory leaks
# Use Chrome DevTools Memory profiler
```

### Slow Database Queries

**Problem:** API responses are slow

**Solutions:**

```javascript
// Create indexes
db.students.createIndex({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });

// Use lean queries
const students = await Student.find().lean();

// Use pagination
const result = await Student.paginate({}, { page: 1, limit: 20 });

// Enable query logging to find slow queries
mongoose.set("debug", true);
```

---

## Deployment Issues

### Build Fails in Production

**Problem:** Build succeeds locally but fails on server

**Solutions:**

```bash
# Check Node.js version matches
node --version  # Should be v22.20.0

# Install exact versions
yarn install --frozen-lockfile

# Clear cache and rebuild
rm -rf node_modules .next
yarn install
yarn build

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI
```

### Application Crashes on Start

**Problem:** Server crashes immediately after starting

**Solutions:**

```bash
# Check logs
# PM2:
pm2 logs digital-student-registration

# Systemd:
journalctl -u digital-student-registration -n 100

# Common causes:
# 1. Missing environment variables
# 2. MongoDB not accessible
# 3. Port already in use
# 4. Insufficient permissions
```

### Nginx 502 Bad Gateway

**Problem:** Nginx returns 502 error

**Solutions:**

```bash
# Check if application is running
pm2 status
# or
systemctl status digital-student-registration

# Check nginx configuration
sudo nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Common fix: Restart application
pm2 restart digital-student-registration
```

### SSL Certificate Issues

**Problem:** Browser shows SSL warnings

**Solutions:**

```bash
# Verify certificate files exist
ls -la /etc/letsencrypt/live/your-domain.com/

# Renew certificate
sudo certbot renew

# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -dates

# Restart nginx
sudo systemctl restart nginx
```

---

## Common Error Messages

### "Module not found"

```
Error: Cannot find module '@/components/...'
```

**Fix:** Check TypeScript path aliases in `tsconfig.json`

### "EADDRINUSE"

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:** Kill process on port 3000 or use different port

### "Cannot read property 'x' of undefined"

```
TypeError: Cannot read property 'x' of undefined
```

**Fix:** Add null checks and optional chaining

```typescript
// ✅ Good
const name = user?.profile?.name || "Unknown";

// ❌ Bad
const name = user.profile.name;
```

### "Hydration failed"

```
Error: Hydration failed because the initial UI does not match
```

**Fix:** Ensure server and client render the same content initially

---

## Getting Help

If you can't resolve an issue:

1. **Check Logs:**
   - Application logs: `pm2 logs` or `journalctl -u service-name`
   - Nginx logs: `/var/log/nginx/error.log`
   - Browser console: F12 → Console tab

2. **Search Documentation:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Mongoose Docs](https://mongoosejs.com/docs/)
   - [Material-UI Docs](https://mui.com/)

3. **Check GitHub Issues:**
   - Search existing issues in the repository

4. **Provide Details:**
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Relevant logs

---

## Prevention Tips

1. **Keep dependencies updated:**

   ```bash
   yarn outdated
   yarn upgrade-interactive
   ```

2. **Regular backups:**
   - Database: Daily automated backups
   - Code: Git commits

3. **Monitor logs:**
   - Set up log monitoring
   - Create alerts for errors

4. **Test before deploying:**

   ```bash
   yarn test
   yarn test:e2e
   yarn build
   ```

5. **Use version control:**
   - Commit frequently
   - Use meaningful commit messages
   - Never commit secrets
