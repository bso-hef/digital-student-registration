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

**Problem:** `Error: unable to verify certificate`

```bash
yarn dev  # Uses ./certificates/
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
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

### Playwright Browser Not Found

```bash
yarn playwright:install
npx playwright install chromium
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

```typescript
// tests/setup.ts
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./mocks/server";

beforeAll(() => server.listen());
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
pm2 monit
NODE_OPTIONS="--max-old-space-size=4096" yarn start
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

### Application Crashes on Start

```bash
# Check logs
pm2 logs digital-student-registration
journalctl -u digital-student-registration -n 100

# Common causes:
# - Missing env variables
# - MongoDB not accessible
# - Port in use
```

### Nginx 502 Bad Gateway

```bash
# Check app status
pm2 status
systemctl status digital-student-registration

# Check nginx
sudo nginx -t
tail -f /var/log/nginx/error.log

# Restart
pm2 restart digital-student-registration
```

### SSL Certificate Issues

```bash
# Verify certificates
ls -la /etc/letsencrypt/live/your-domain.com/

# Renew
sudo certbot renew

# Check expiration
openssl x509 -in cert.pem -noout -dates

# Restart nginx
sudo systemctl restart nginx
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

- Application: `pm2 logs` or `journalctl -u service-name`
- Nginx: `/var/log/nginx/error.log`
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
yarn test
yarn test:e2e
yarn build
```

**Best practices:**

- Regular database backups
- Monitor logs with alerts
- Commit frequently with meaningful messages
- Never commit secrets
