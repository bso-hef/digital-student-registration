# Digital Student Registration

> Modern full-stack web application for managing student onboarding and class administration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-v22.20.0-brightgreen)](https://nodejs.org/)
[![Yarn Version](https://img.shields.io/badge/yarn-1.22.22-blue)](https://yarnpkg.com/)
[![Docker](https://img.shields.io/badge/docker-supported-blue)](https://www.docker.com/)
[![Windows Container](https://img.shields.io/badge/windows%20container-supported-blue)](https://docs.microsoft.com/en-us/virtualization/windowscontainers/)

---

## About the Project

**Digital Student Registration** is a comprehensive student administration system designed to streamline the onboarding process for educational institutions. It provides tools for managing classes, tracking student information, and guiding students through a structured registration workflow.

- **Multi-step student onboarding** with 11-form wizard
- **Admin dashboard** with real-time statistics and drag-and-drop layout
- **Class & student management** for grades 1-13 with vocational support
- **Bilingual interface** (English & German)
- **Data export** to PDF, Excel, CSV
- **Full accessibility** with dark mode and dyslexia-friendly fonts

---

## 🚀 Quick Start for Testers

**Want to test the application with Docker?**

```bash
cp .env.example .env          # set MONGO_PASSWORD, REDIS_PASSWORD, NEXTAUTH_SECRET
./scripts/docker-build.sh     # build the app image (Windows: scripts\docker-build.ps1)
docker compose --profile linux up -d
```

Then open [http://localhost:3000](http://localhost:3000) and complete the
one-time setup wizard to create your admin account.

→ See **[QUICK-START.md](./QUICK-START.md)** for the complete testing guide
(environment setup, first-run wizard, and test scenarios).

**Requirements:** Docker 20.10+ and Docker Compose 2.0+ ([Install Docker](https://docs.docker.com/get-docker/))

---

## Tech Stack

### Frontend

- **Next.js 15.4.10** (App Router) with React 19.1.0
- **TypeScript 5** for type safety
- **Material-UI v7** with Emotion styling
- **Redux Toolkit** for state management with Redux Persist
- **Formik + Yup** for form handling and validation
- **i18next** with browser language detection

### Backend

- **Next.js API Routes** (integrated backend)
- **MongoDB** with Mongoose 8.18.0
- **mongoose-paginate-v2** for efficient pagination

### Testing

- **Vitest** - 2000+ unit tests across 76 test files (integration suite currently disabled — see `docs/development/TESTING.md`)
- **React Testing Library** for component testing
- **MSW** (Mock Service Worker) for API mocking (integration tests)

### Additional Tools

- **Socket.IO** client for real-time features (ready for integration)
- **Sonner** for toast notifications
- **Day.js** for date manipulation
- **jsPDF** and **JSZip** for document generation

---

## Getting Started

### Prerequisites

- Node.js v22.20.0 (see `.nvmrc`)
- Yarn 1.22.22
- MongoDB 7.0 (the Docker stack uses `mongo:7.0`)

### Development

```bash
# Clone repository
git clone https://github.com/bso-hef/digital-student-registration.git
cd digital-student-registration

# Install dependencies
yarn install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and credentials

# Start MongoDB (if local)
# mongod

# Run development server
yarn dev
```

Open [https://localhost:3000](https://localhost:3000)

### Docker (Recommended)

```bash
# Copy and fill in the environment template
cp .env.example .env
# Set MONGO_USER, MONGO_PASSWORD, REDIS_PASSWORD, NEXTAUTH_SECRET (no defaults)

# Build the app image (compose runs a pre-built image, it does not build on `up`)
./scripts/docker-build.sh           # Windows: scripts\docker-build.ps1

# Start the full stack — the app service is gated behind a profile
docker compose --profile linux up -d   # Windows containers: --profile windows
# → http://localhost:3000 (the container serves HTTP; TLS via reverse proxy in prod)
```

On first launch, complete the setup wizard at `/setup` to create the initial
admin account.

**Full Documentation:**

- **[QUICK-START.md](./QUICK-START.md)** - Docker testing guide (setup wizard & scenarios)
- **[docs/development/SETUP.md](./docs/development/SETUP.md)** - Development setup guide
- **[docs/development/DEPLOYMENT.md](./docs/development/DEPLOYMENT.md)** - Production deployment guide
- **[DOCKER.md](./DOCKER.md)** - Docker configuration details

---

## How to Develop

### Available Commands

```bash
# Development
yarn dev          # Start dev server with HTTPS
yarn build        # Production build
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn format       # Format with Prettier

# Testing
yarn test                    # Vitest in watch mode
yarn test:unit              # Single run with coverage
yarn test:watch             # Watch mode (explicit)
yarn test:coverage          # Coverage report (== test:unit)
yarn test:ui                # Interactive UI
yarn test:all               # Alias of test:unit
yarn test:ts                # TypeScript type check
```

### Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── (home)/admin/      # Admin dashboard & management
│   ├── (home)/student/    # Student onboarding flow
│   └── api/               # Backend API routes
├── components/            # Atomic design (atoms/molecules/organisms)
├── store/                 # Redux state management
├── models/                # Mongoose schemas
├── lib/                   # Services, config, validation
└── theme/                 # MUI theme system
```

### Commit Guidelines

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and
are enforced by a `commit-msg` git hook (commitlint):

```text
<type>(<optional scope>): <summary>
```

Example:

```text
feature: add student export functionality
bugfix(classes): correct student count after deletion
```

Allowed types: `feature`, `bugfix`, `patch`, `docs`, `test`, `ci`, `revert`,
`release`, `hotfix`.

**Important:** Never use `--no-verify` or `--force` flags.

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full workflow.

---

## Testing Proccess

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With coverage
yarn test:coverage

# Interactive UI
yarn test:ui
```

---

## Documentation

**Release Documentation:**

- **[CHANGELOG.md](./CHANGELOG.md)** - Technical changelog
- **[RELEASE_NOTES.md](./RELEASE_NOTES.md)** - Release notes (German)
- **[DOCKER.md](./DOCKER.md)** - Docker deployment guide

**Development Docs:** [docs/development/](./docs/development/)

- API.md • ARCHITECTURE.md • COMPONENTS.md • DATABASE.md • DEPLOYMENT.md • SETUP.md • TESTING.md • TROUBLESHOOTING.md

**Public Docs:** [docs/public/](./docs/public/)

- ONBOARDING.md - Student onboarding flow documentation

---

## API Overview

**Classes:** `GET|POST|DELETE /api/classes`

**Students:** `GET|POST|DELETE /api/students`

**Dashboard:** `GET /api/dashboard/stats`

**Health:** `GET /api/health/live` • `GET /api/health/full`

---

## Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)**
for the development setup, branch and commit conventions, and the pull-request
process. By participating you agree to our
**[Code of Conduct](./CODE_OF_CONDUCT.md)**.

- 🐛 **Found a bug?** Open a [bug report](./.github/ISSUE_TEMPLATE/bug_report.yml).
- 💡 **Have an idea?** Open a [feature request](./.github/ISSUE_TEMPLATE/feature_request.yml).
- 🔒 **Security issue?** Follow our [Security Policy](./SECURITY.md) — do not open a public issue.

---

## License

MIT License - Copyright (c) 2025 Beruflichen Schulen Obersberg

---

## Repository

**GitHub:** [bso-hef/digital-student-registration](https://github.com/bso-hef/digital-student-registration)

**Issues:** [Report bugs or request features](https://github.com/bso-hef/digital-student-registration/issues)
