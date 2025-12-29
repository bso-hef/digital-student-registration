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
use digital-student-onboarding
db.students.insertOne({ test: "data" })
db.students.find()
db.students.deleteOne({ test: "data" })
exit
```

---

## SSL Certificates

Application uses HTTPS in development via self-signed certificates.

### Certificates Location

```
./certificates/
├── localhost.pem       # Certificate
└── localhost-key.pem   # Private key
```

### Generate New Certificates

```bash
# Install mkcert
# Windows (Chocolatey)
choco install mkcert

# Mac
brew install mkcert

# Linux
sudo apt install libnss3-tools
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
sudo chmod +x /usr/local/bin/mkcert

# Install local CA
mkcert -install

# Generate certificates
cd certificates
mkcert localhost
```

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

```env
# Environment
NODE_ENV=development

# API URL (HTTPS)
NEXT_PUBLIC_API_URL=https://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding

# Optional MongoDB Auth
# MONGO_USER=dev_user
# MONGO_PASSWORD=dev_password

# App Info
NEXT_PUBLIC_VERSION=$npm_package_version
NEXT_PUBLIC_NAME=$npm_package_name

# Logging
LOG_LEVEL=debug
```

### Environment Variables

| Variable              | Purpose            | Required |
| --------------------- | ------------------ | -------- |
| `NODE_ENV`            | Environment mode   | Yes      |
| `NEXT_PUBLIC_API_URL` | API base URL       | Yes      |
| `MONGODB_URI`         | MongoDB connection | Yes      |
| `MONGO_USER`          | MongoDB username   | No       |
| `MONGO_PASSWORD`      | MongoDB password   | No       |
| `LOG_LEVEL`           | Logging verbosity  | No       |

**Note:** `NEXT_PUBLIC_*` variables exposed to browser.

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

`.vscode/settings.json`:

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

`.vscode/launch.json`:

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

Trust certificates in browser or regenerate with `mkcert`.

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
yarn test             # Run unit tests
yarn test:e2e         # Run E2E tests
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
