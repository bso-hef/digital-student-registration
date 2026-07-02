# Development Setup Guide

Complete guide for setting up development environment.

## Prerequisites

### Required Software

| Software | Version  | Required    | Notes           |
| -------- | -------- | ----------- | --------------- |
| Node.js  | v22.20.0 | Yes         | Exact version   |
| Yarn     | 1.22.22  | Yes         | Package manager |
| MongoDB  | 7.0+     | Yes         | Database        |
| Git      | Latest   | Yes         | Version control |
| VS Code  | Latest   | Recommended | IDE             |

### Install Node.js

```bash
# Windows (nvm-windows)
nvm install 22.20.0
nvm use 22.20.0

# Mac/Linux (nvm)
nvm install 22.20.0
nvm use 22.20.0

# Verify
node --version  # Should output: v22.20.0
```

### Install Yarn

```bash
npm install -g yarn@1.22.22

# Verify
yarn --version  # Should output: 1.22.22
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Verify Installation

```bash
ls node_modules
yarn next --version
```

---

## MongoDB Setup

### Install MongoDB

**Windows:**

1. Download MongoDB Community Server from mongodb.com
2. Run installer with defaults
3. MongoDB runs as Windows Service

**Mac:**

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu):**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify MongoDB

```bash
mongosh
# Should see MongoDB shell
exit
```

### Create Development Database

```bash
mongosh
use digital-student-registration
db.students.insertOne({ test: "data" })
db.students.find()
db.students.deleteOne({ test: "data" })
exit
```

---

## SSL Certificates

The dev server runs over HTTPS in development. The `dev` script uses
`next dev --turbopack --experimental-https`, which **automatically generates
and manages self-signed certificates** for `localhost`. There is no manual
certificate setup and no `certificates/` directory to create.

The certificates are created the first time you run `yarn dev` and are stored
by Next.js internally (under `~/.next` / the user's certificate directory).

### Trust Certificates

Browser warnings on first visit:

- **Chrome**: "Advanced" → "Proceed to localhost"
- **Firefox**: "Advanced" → "Accept Risk"

---

## Environment Configuration

### Create .env.local

```bash
cp .env.example .env.local
```

### Edit .env.local

The keys below mirror `.env.example`. For local development, set the URLs to
`https://localhost:3000` and provide your local MongoDB/Redis values.

```env
NODE_ENV=development
APP_NAME=Digital Student Registration
APP_VERSION=2.1.0

# Port the app is accessed on (container always runs on 3000 internally)
APP_PORT=3000
DOCKER_IMAGE=dsr-app

# Application URLs (use localhost for local dev)
NEXT_PUBLIC_APP_URL=https://localhost:3000
NEXT_PUBLIC_API_URL=https://localhost:3000
NEXTAUTH_URL=https://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/digital-student-registration
MONGO_USER=admin
MONGO_PASSWORD=CHANGE_ME
MONGO_DB=digital-student-registration

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=CHANGE_ME

# NextAuth
NEXTAUTH_SECRET=CHANGE_ME_TO_RANDOM_64_CHAR_STRING

NEXT_TELEMETRY_DISABLED=1
```

### Environment Variables

| Variable                  | Purpose                                   | Required |
| ------------------------- | ----------------------------------------- | -------- |
| `NODE_ENV`                | Environment mode                          | Yes      |
| `APP_NAME`                | Application display name                  | Yes      |
| `APP_VERSION`             | Application version                       | Yes      |
| `APP_PORT`                | External host port (container uses 3000)  | Yes      |
| `DOCKER_IMAGE`            | Docker image name used by docker-compose  | Yes      |
| `NEXT_PUBLIC_APP_URL`     | Public app base URL (embedded at build)   | Yes      |
| `NEXT_PUBLIC_API_URL`     | API base URL (embedded at build)          | Yes      |
| `NEXTAUTH_URL`            | NextAuth callback base URL                | Yes      |
| `MONGODB_URI`             | MongoDB connection string                 | Yes      |
| `MONGO_USER`              | MongoDB username                          | Yes      |
| `MONGO_PASSWORD`          | MongoDB password                          | Yes      |
| `MONGO_DB`                | MongoDB database name                     | Yes      |
| `REDIS_URL`               | Redis connection string                   | Yes      |
| `REDIS_PASSWORD`          | Redis password                            | Yes      |
| `NEXTAUTH_SECRET`         | NextAuth signing secret (random 64 chars) | Yes      |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry                 | No       |

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser and are embedded
at **build time** (using `localhost` in production breaks QR codes/PDFs/emails).

---

## Running Application

### Start Dev Server

```bash
yarn dev
```

Starts:

- Next.js with Turbopack (fast refresh)
- HTTPS on `https://localhost:3000`
- API routes at `/api/*`

### Verify Running

Open browser: `https://localhost:3000`

### Dev Server Features

- Hot Module Replacement (HMR)
- Fast Refresh (preserves state)
- Turbopack (ultra-fast bundler)
- HTTPS in development
- Backend API routes

### Stop Server

Press `Ctrl+C`

---

## Development Tools

### VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens"
  ]
}
```

### VS Code Settings

The repo does not include a `.vscode/` directory. If you want editor-level
formatting and lint-on-save, you can create your own `.vscode/settings.json`,
for example:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

### Browser DevTools

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

---

## Common Tasks

### Linting

```bash
yarn lint
yarn lint --fix
```

### Code Formatting

```bash
yarn format
yarn prettier --write src/components/**/*.tsx
```

### Type Checking

```bash
npx tsc --noEmit
```

### Clear Cache

```bash
rm -rf .next
rm -rf node_modules
yarn install
```

### Build Production

```bash
yarn build
yarn start
```

---

## Debugging

### Client-Side (Browser)

1. Open DevTools (F12)
2. Go to Sources tab
3. Find file in `webpack://` tree
4. Set breakpoints

### Server-Side (API Routes)

```typescript
export async function GET(req: NextRequest) {
  console.log("API route called:", req.url);
  const data = await fetchData();
  console.log("Data fetched:", data);
  return NextResponse.json(data);
}
```

### VS Code Launch Config

The repo does not include a `.vscode/launch.json`. To enable VS Code debugging,
you can create one yourself, for example:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Next.js: debug client-side",
      "url": "https://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "runtimeArgs": ["--ignore-certificate-errors"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Next.js: debug server-side",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev"],
      "port": 9229
    }
  ]
}
```

### MongoDB Debugging

**Compass GUI:** Download from mongodb.com

**Enable Mongoose Debug:**

```typescript
// src/lib/config/mongo.ts
mongoose.set("debug", true);
```

---

## Troubleshooting

### Port 3000 in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Starting

```bash
# Windows
net start MongoDB

# Mac
brew services list

# Linux
sudo systemctl status mongod
```

### SSL Certificate Warnings

Trust the auto-generated certificate in your browser. To force Next.js to
regenerate it, stop the dev server and restart `yarn dev` (the
`--experimental-https` flag recreates certificates as needed).

### Dependencies Not Installing

```bash
yarn cache clean
rm yarn.lock
yarn install
```

---

## Next Steps

Once setup complete:

1. Read [COMPONENTS.md](./COMPONENTS.md) for component development
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture
3. Read [TESTING.md](./TESTING.md) for testing guide
4. Read [API.md](./API.md) for API documentation

---

## Quick Reference

### Commands

```bash
yarn dev              # Start dev server
yarn build            # Build for production
yarn lint             # Check for errors
yarn format           # Format code
yarn test             # Run Vitest in WATCH mode (interactive)
yarn test:unit        # Run unit tests once (with coverage)
yarn test:coverage    # Run unit tests once with coverage report
yarn test:watch       # Run Vitest in watch mode
yarn test:ui          # Run Vitest with the UI
yarn test:ts          # Type-check (tsc --noEmit)
```

### URLs

```
https://localhost:3000           # Homepage
https://localhost:3000/admin     # Admin dashboard
https://localhost:3000/api/*     # API endpoints
```

### Directories

```
src/app/         # Pages and API routes
src/components/  # UI components
src/store/       # Redux state
src/models/      # Database models
```
