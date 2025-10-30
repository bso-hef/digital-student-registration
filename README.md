# Digital Student Registration

> A modern, full-stack web application for managing student onboarding and class administration in educational institutions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-v22.20.0-brightgreen)](https://nodejs.org/)
[![Yarn Version](https://img.shields.io/badge/yarn-1.22.22-blue)](https://yarnpkg.com/)

---

## About the Project

**Digital Student Registration** is a comprehensive student administration system designed to streamline the onboarding process for educational institutions. It provides tools for managing classes, tracking student information, and guiding students through a structured registration workflow.

### Key Features

- **Multi-Step Student Onboarding** - 10-form wizard collecting personal, educational, and vocational information
- **Admin Dashboard** - Real-time statistics, health monitoring, and customizable drag-and-drop layout
- **Class Management** - Support for grades 1-13, vocational training programs, and school year tracking
- **Student Management** - Batch operations, advanced search with name normalization, and data export
- **Internationalization** - Bilingual support (English & German) with automatic language detection
- **Accessibility Features** - Dark mode, high contrast mode, dyslexia-friendly font (OpenDyslexic)
- **Data Export** - Export student and class data to PDF, Excel, and other formats
- **Responsive Design** - Mobile-first approach with adaptive layouts for all screen sizes

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
- **Playwright** - 98+ E2E tests across browsers
- **React Testing Library** for component testing
- **MSW** (Mock Service Worker) for API mocking
- **Visual Regression Testing** with Playwright snapshots

### Additional Tools

- **Socket.IO** client for real-time features (ready for integration)
- **Sonner** for toast notifications
- **Day.js** for date manipulation
- **jsPDF** and **JSZip** for document generation

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: `v22.20.0` (required)
- **Yarn**: `1.22.22` (required)
- **MongoDB**: Running locally or accessible via connection string

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bso-hef/digital-student-registration.git
   cd digital-student-registration
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```env
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=https://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding
   MONGO_USER=your_db_username
   MONGO_PASSWORD=your_db_password
   NEXT_PUBLIC_VERSION=$npm_package_version
   NEXT_PUBLIC_NAME=$npm_package_name
   ```

   See `.env.example` for reference.

4. **Set up SSL certificates (for local HTTPS development)**

   SSL certificates are located in `./certificates/`. Next.js dev server uses these automatically with the `--experimental-https` flag.

5. **Start MongoDB**

   Ensure MongoDB is running on `localhost:27017` or update the `MONGODB_URI` in your `.env.local`.

6. **Run the development server**

   ```bash
   yarn dev
   ```

   Open [https://localhost:3000](https://localhost:3000) in your browser.

### Production Build

```bash
yarn build
yarn start
```

---

## Project Structure

```
digital-student-registration/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (home)/            # Route group
│   │   │   ├── admin/         # Admin section (dashboard, management, settings)
│   │   │   └── student/       # Student onboarding flow
│   │   └── api/               # Backend API routes (classes, students, health)
│   ├── components/            # Atomic design pattern
│   │   ├── atoms/             # Basic UI elements
│   │   ├── molecules/         # Composed components
│   │   └── organisms/         # Complex features (forms, tables, modals)
│   ├── store/                 # Redux state management
│   │   ├── actions/           # Thunk actions
│   │   └── reducers/          # State slices
│   ├── models/                # Mongoose schemas (Student, Class)
│   ├── lib/                   # Shared libraries
│   │   ├── config/            # MongoDB, i18n, app initialization
│   │   ├── services/          # API service wrappers
│   │   └── validate/          # Yup validation schemas
│   ├── theme/                 # MUI theme system
│   ├── locales/               # i18n translation files (en.json, de.json)
│   └── utils/                 # Utility functions
├── tests/                     # Test suites
│   ├── e2e/                   # Playwright E2E tests
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # Integration tests
│   └── utils/                 # Test utilities and factories
├── docs/                      # Documentation
│   ├── TESTING.md             # Comprehensive testing guide
│   └── Onboarding-process.md  # Student onboarding flow
└── package.json
```

---

## Documentation

This project maintains extensive documentation to help developers understand and contribute:

- **[docs/TESTING.md](./docs/TESTING.md)** - Complete testing documentation:
  - Test structure and organization
  - Writing unit, component, integration, and E2E tests
  - Running tests and viewing coverage
  - CI/CD integration
  - Troubleshooting guide

- **[docs/Onboarding-process.md](./docs/Onboarding-process.md)** - Student onboarding flow documentation

### API Routes

The application uses Next.js API Routes for backend functionality:

- **Classes API** (`/api/classes`)
  - `GET` - Paginated list of classes
  - `POST` - Batch create classes
  - `DELETE` - Batch delete classes
  - `GET /api/classes/[classId]` - Single class details
  - `PATCH /api/classes/[classId]` - Update class
  - `DELETE /api/classes/[classId]` - Delete class

- **Students API** (`/api/students`)
  - `GET` - Paginated list of students
  - `POST` - Batch create students
  - `DELETE` - Batch delete students

- **Dashboard API** (`/api/dashboard/stats`)
  - `GET` - Dashboard statistics and metrics

- **Health API** (`/api/health`)
  - `GET /api/health/live` - Liveness check
  - `GET /api/health/full` - Full health status with database connectivity

---

## Development

### Available Scripts

```bash
# Development
yarn dev          # Start Next.js dev server with Turbopack and HTTPS
yarn build        # Production build
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn format       # Format code with Prettier

# Testing
yarn test                    # Run all unit tests
yarn test:watch             # Watch mode for unit tests
yarn test:ui                # Interactive test UI
yarn test:coverage          # Run tests with coverage report
yarn test:e2e               # Run E2E tests
yarn test:e2e:chromium      # E2E tests in Chromium only
yarn test:e2e:headed        # E2E tests with visible browser
yarn test:e2e:debug         # E2E tests in debug mode
yarn test:all               # Run all tests (unit + E2E)

# Playwright
yarn playwright:install     # Install browser binaries
yarn playwright:report      # View test report
```

### Code Formatting

This project uses Prettier for code formatting. Before committing:

```bash
yarn format
```

### Commit Conventions

Follow these commit message guidelines:

```
feature/bugfix/patch: AUTHOR TICKET-NUMBER description
```

Examples:

```
feature: Valentin Roehle #123 Add student export functionality
bugfix: Valentin Roehle #456 Fix class validation error
```

**Important**:

- Never use `--no-verify` flag when committing (pre-commit hooks must run)
- Never use `--force` flag when pushing
- Keep commit messages to one line

---

## Testing

This project maintains comprehensive test coverage across multiple testing layers.

### Test Summary

```
Total Tests: 1,062+
├── Unit Tests (Vitest): 964
│   ├── Atoms: 723
│   ├── Molecules: 106
│   └── Organisms: 135
└── E2E Tests (Playwright): 98
    ├── Admin Dashboard: 20
    ├── Classes Management: 17
    ├── Students Management: 17
    ├── Admin Settings: 19
    └── Student Onboarding: 25
```

### Quick Start

```bash
# Run all unit tests
yarn test

# Run E2E tests
yarn test:e2e:chromium

# Run all tests
yarn test:all

# View coverage report
yarn test:coverage
```

### First-Time E2E Setup

Before running E2E tests for the first time:

```bash
# Install Playwright browsers
yarn playwright:install

# Start dev server (in separate terminal)
yarn dev

# Run E2E tests
yarn test:e2e
```

For comprehensive testing documentation, see **[docs/TESTING.md](./docs/TESTING.md)**.

---

### Before Submitting

```bash
yarn lint          # Check for linting errors
yarn format        # Format code
yarn test          # Run unit tests
yarn test:e2e      # Run E2E tests
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Beruflichen Schulen Obersberg

---

## Repository

- **GitHub**: [bso-hef/digital-student-registration](https://github.com/bso-hef/digital-student-registration)
- **Issues**: [Report bugs or request features](https://github.com/bso-hef/digital-student-registration/issues)

---

## Acknowledgments

Built with modern web technologies and best practices to provide a robust, scalable solution for educational institutions.

For questions or support, please open an issue on GitHub.
