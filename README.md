# Digital Student Registration

> Modern full-stack web application for managing student onboarding and class administration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-v22.20.0-brightgreen)](https://nodejs.org/)
[![Yarn Version](https://img.shields.io/badge/yarn-1.22.22-blue)](https://yarnpkg.com/)

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

## Tech Stack

### Frontend

- **Next.js 15.4.2** (App Router) with React 19.1.0
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

- **Vitest** - 964+ unit and integration tests
- **React Testing Library** for component testing
- **MSW** (Mock Service Worker) for API mocking

### Additional Tools

- **Socket.IO** client for real-time features (ready for integration)
- **Sonner** for toast notifications
- **Day.js** for date manipulation
- **jsPDF** and **JSZip** for document generation

---

## Getting Started

### Prerequisites

- Node.js v22.20.0
- Yarn 1.22.22
- MongoDB 4.4+

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
# Development
cp .env.docker.example .env
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d --build
```

See **[DOCKER.md](./DOCKER.md)** for complete Docker documentation.

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
yarn test                    # Run unit tests
yarn test:watch             # Watch mode
yarn test:coverage          # Coverage report
yarn test:ui                # Interactive UI
yarn test:all               # Run all tests
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

```text
feature/bugfix/patch: AUTHOR TICKET-NUMBER description
```

Example:

```text
feature: Valentin Roehle #123 Add student export functionality
```

**Important:** Never use `--no-verify` or `--force` flags.

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

## License

MIT License - Copyright (c) 2025 Beruflichen Schulen Obersberg

---

## Repository

**GitHub:** [bso-hef/digital-student-registration](https://github.com/bso-hef/digital-student-registration)

**Issues:** [Report bugs or request features](https://github.com/bso-hef/digital-student-registration/issues)
