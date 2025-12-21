# Development Setup Guide

Complete guide for setting up the development environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [MongoDB Setup](#mongodb-setup)
- [SSL Certificates](#ssl-certificates)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Tools](#development-tools)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)

---

## Prerequisites

### Required Software

| Software | Version  | Required    | Notes                  |
| -------- | -------- | ----------- | ---------------------- |
| Node.js  | v22.20.0 | Yes         | Exact version required |
| Yarn     | 1.22.22  | Yes         | Package manager        |
| MongoDB  | 7.0+     | Yes         | Database               |
| Git      | Latest   | Yes         | Version control        |
| VS Code  | Latest   | Recommended | IDE                    |

### Install Node.js

```bash
# Windows (using nvm-windows)
nvm install 22.20.0
nvm use 22.20.0

# Mac/Linux (using nvm)
nvm install 22.20.0
nvm use 22.20.0

# Verify installation
node --version  # Should output: v22.20.0
```

### Install Yarn

```bash
npm install -g yarn@1.22.22

# Verify installation
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

This installs all dependencies defined in `package.json`.

### 3. Verify Installation

```bash
# Check for node_modules directory
ls node_modules

# Verify Next.js is installed
yarn next --version
```

---

## MongoDB Setup

### Install MongoDB

**Windows:**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer with default settings
3. MongoDB runs as Windows Service automatically

**Mac (using Homebrew):**

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

### Verify MongoDB is Running

```bash
# Connect to MongoDB
mongosh

# Should see MongoDB shell prompt
# Type 'exit' to quit
```

### Create Development Database

```bash
mongosh

# Create database
use digital-student-onboarding

# Create a test collection (optional)
db.students.insertOne({ test: "data" })

# Verify
db.students.find()

# Clean up test data
db.students.deleteOne({ test: "data" })

exit
```

---

## SSL Certificates

The application uses HTTPS in development via self-signed certificates.

### Certificates Location

```
./certificates/
├── localhost.pem       # Certificate
└── localhost-key.pem   # Private key
```

### Generate New Certificates (if needed)

```bash
# Install mkcert (one-time setup)
# Windows (using Chocolatey)
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

### Trust Certificates in Browser

After first run, you may need to:

1. **Chrome**: Visit `https://localhost:3000`, click "Advanced", then "Proceed to localhost"
2. **Firefox**: Click "Advanced", then "Accept the Risk and Continue"

For permanent trust, import the certificate to your system's trusted root certificates.

---

## Environment Configuration

### Create .env.local File

```bash
cp .env.example .env.local
```

### Edit .env.local

```env
# Application Environment
NODE_ENV=development

# API URL (with HTTPS)
NEXT_PUBLIC_API_URL=https://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding

# Optional: MongoDB Authentication (if enabled)
# MONGO_USER=dev_user
# MONGO_PASSWORD=dev_password

# Application Info
NEXT_PUBLIC_VERSION=$npm_package_version
NEXT_PUBLIC_NAME=$npm_package_name

# Logging Level
LOG_LEVEL=debug
```

### Environment Variables Explained

| Variable              | Purpose                    | Required |
| --------------------- | -------------------------- | -------- |
| `NODE_ENV`            | Environment mode           | Yes      |
| `NEXT_PUBLIC_API_URL` | API base URL (client-side) | Yes      |
| `MONGODB_URI`         | MongoDB connection string  | Yes      |
| `MONGO_USER`          | MongoDB username           | No       |
| `MONGO_PASSWORD`      | MongoDB password           | No       |
| `LOG_LEVEL`           | Logging verbosity          | No       |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Running the Application

### Start Development Server

```bash
yarn dev
```

This starts:

- Next.js dev server with Turbopack (fast refresh)
- HTTPS on `https://localhost:3000`
- API routes at `/api/*`

### Verify Application is Running

Open browser and navigate to:

```
https://localhost:3000
```

You should see the application homepage.

### Development Server Features

- **Hot Module Replacement (HMR)**: Changes reflect immediately
- **Fast Refresh**: Preserves React state during updates
- **Turbopack**: Ultra-fast bundler (faster than Webpack)
- **HTTPS**: Secure connection in development
- **API Routes**: Backend endpoints available at `/api/*`

### Stop Development Server

Press `Ctrl+C` in the terminal.

---

## Development Tools

### VS Code Extensions (Recommended)

Install these extensions for better DX:

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

Create `.vscode/settings.json`:

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

**React Developer Tools:**

- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Redux DevTools:**

- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

---

## Common Tasks

### Linting

```bash
# Check for linting errors
yarn lint

# Auto-fix errors (where possible)
yarn lint --fix
```

### Code Formatting

```bash
# Format all code
yarn format

# Format specific files
yarn prettier --write src/components/**/*.tsx
```

### Type Checking

```bash
# Run TypeScript compiler without emitting
npx tsc --noEmit
```

### Clear Cache

```bash
# Remove Next.js cache
rm -rf .next

# Remove node_modules (nuclear option)
rm -rf node_modules
yarn install
```

### Build Production Bundle

```bash
yarn build
```

### Run Production Build Locally

```bash
yarn build
yarn start
```

---

## Debugging

### Client-Side Debugging

#### Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to **Sources** tab
3. Find your file in `webpack://` tree
4. Set breakpoints
5. Refresh page

#### VS Code Debugging

Create `.vscode/launch.json`:

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
    }
  ]
}
```

### Server-Side Debugging

#### Console Logging

```typescript
// API Route
export async function GET(req: NextRequest) {
  console.log("API route called:", req.url);
  const data = await fetchData();
  console.log("Data fetched:", data);
  return NextResponse.json(data);
}
```

#### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Next.js: debug server-side",
  "runtimeExecutable": "yarn",
  "runtimeArgs": ["dev"],
  "port": 9229,
  "console": "integratedTerminal"
}
```

### Redux Debugging

Use **Redux DevTools** browser extension:

1. Install extension
2. Open DevTools
3. Go to **Redux** tab
4. View state, actions, and time-travel debugging

### MongoDB Debugging

#### MongoDB Compass (GUI)

1. Download from [mongodb.com](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Browse collections and documents

#### Enable Mongoose Debug Mode

```typescript
// src/lib/config/mongo.ts
mongoose.set("debug", true);
```

This logs all MongoDB queries to console.

---

## Project Structure Overview

```
digital-student-registration/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── store/            # Redux state
│   ├── models/           # Mongoose schemas
│   ├── lib/              # Utilities & services
│   ├── theme/            # MUI theme
│   ├── locales/          # Translations
│   └── utils/            # Helper functions
├── tests/                # Test files
├── docs/                 # Documentation
├── public/               # Static assets
└── certificates/         # SSL certificates
```

---

## Workflow Tips

### 1. Use Hot Reload Effectively

- Save files to see changes instantly
- React state persists during updates
- API changes require manual refresh

### 2. Keep Dev Server Running

- Don't restart unless necessary
- Faster than rebuilding each time

### 3. Use TypeScript Effectively

- Let IntelliSense guide you
- Fix type errors early
- Use strict mode

### 4. Check Logs Regularly

Watch terminal for:

- Compilation errors
- Runtime errors
- API request logs
- MongoDB connection status

### 5. Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feature: Your Name #123 Description"

# Push to remote
git push origin feature/my-feature
```

---

## Troubleshooting Setup Issues

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Starting

```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Mac
brew services list

# Linux
sudo systemctl status mongod
```

### SSL Certificate Warnings

Trust the certificates in your browser or regenerate them with `mkcert`.

### Dependencies Not Installing

```bash
# Clear yarn cache
yarn cache clean

# Remove lock file
rm yarn.lock

# Reinstall
yarn install
```

---

## Next Steps

Once setup is complete:

1. Read [COMPONENTS.md](./COMPONENTS.md) for component development
2. Read [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) for Redux patterns
3. Read [FORMS.md](./FORMS.md) for form handling
4. Read [STYLING.md](./STYLING.md) for theming and styling

---

## Quick Reference

### Essential Commands

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn lint             # Check for errors
yarn format           # Format code
yarn test             # Run unit tests
yarn test:e2e         # Run E2E tests
```

### Essential URLs

```
https://localhost:3000           # Homepage
https://localhost:3000/admin     # Admin dashboard
https://localhost:3000/api/*     # API endpoints
```

### Essential Directories

```
src/app/         # Pages and API routes
src/components/  # UI components
src/store/       # Redux state
src/models/      # Database models
```
