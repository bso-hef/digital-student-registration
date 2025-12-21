# Testing Documentation

Comprehensive testing guide for the Digital Student Registration application.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Test Structure](#test-structure)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Coverage](#coverage)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses a comprehensive testing strategy covering:

- **Unit Tests**: Testing individual functions and utilities
- **Component Tests**: Testing React components in isolation
- **Integration Tests**: Testing Redux actions, API routes, and database operations
- **E2E Tests**: Testing complete user workflows
- **Visual Regression Tests**: Ensuring UI consistency across changes

**Coverage Target**: 60-80%

---

## Tech Stack

### Testing Frameworks

- **[Vitest](https://vitest.dev/)** - Fast unit/integration test runner (faster than Jest)
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[Playwright](https://playwright.dev/)** - E2E testing across browsers
- **[MSW](https://mswjs.io/)** (Mock Service Worker) - API mocking

### Additional Tools

- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - Simulating user interactions
- **@axe-core/playwright** - Accessibility testing
- **mongodb-memory-server** - In-memory MongoDB for tests
- **@vitest/coverage-v8** - Code coverage reports

---

## Getting Started

### Install Dependencies

All testing dependencies are already installed. If you need to reinstall:

```bash
yarn install
```

### Install Playwright Browsers

Install browser binaries for E2E testing:

```bash
yarn playwright:install
```

---

## Test Structure

### Directory Organization

```text
tests/
├── e2e/                          # End-to-end tests (Playwright)
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── dashboard.spec.ts
│   │   ├── classes/
│   │   │   ├── view-classes.spec.ts
│   │   │   ├── create-class.spec.ts
│   │   │   └── ...
│   │   └── students/
│   │       └── ...
│   ├── student-onboarding/
│   │   └── complete-flow.spec.ts
│   └── accessibility/
│       └── ...
├── visual/                       # Visual regression tests
│   ├── components/
│   ├── pages/
│   └── responsive/
├── components/                   # Component tests (Vitest + RTL)
│   ├── atoms/
│   │   ├── GeneralButton/
│   │   │   └── GeneralButton.test.tsx
│   │   └── ...
│   ├── molecules/
│   │   └── ...
│   └── organisms/
│       └── ...
├── unit/                         # Unit tests (Vitest)
│   ├── utils/
│   │   ├── general/
│   │   │   └── general.utils.test.ts
│   │   └── ...
│   ├── validation/
│   │   └── student.validate.test.ts
│   ├── config/
│   │   └── ...
│   └── services/
│       └── ...
├── integration/                  # Integration tests (Vitest)
│   ├── store/
│   │   └── actions/
│   │       ├── classActions/
│   │       │   └── classActions.test.ts
│   │       └── ...
│   ├── api/
│   │   ├── classes/
│   │   │   └── classes.route.test.ts
│   │   └── ...
│   └── models/
│       └── ...
├── utils/                        # Test utilities
│   ├── test-utils.tsx            # renderWithProviders, mock store
│   └── factories.ts              # Mock data generators
├── mocks/                        # MSW handlers
│   ├── handlers.ts
│   └── server.ts
└── setup.ts                      # Global test setup
```

### Naming Conventions

- **Unit/Component/Integration tests**: `*.test.ts` or `*.test.tsx`
- **E2E tests**: `*.spec.ts`
- **Visual tests**: `*.visual.spec.ts`

Each testable unit should have its own folder containing its test file(s).

---

## Running Tests

### All Test Commands

```bash
# Run all unit and integration tests
yarn test

# Run tests in watch mode (useful during development)
yarn test:watch

# Run tests with UI (interactive)
yarn test:ui

# Run tests with coverage report
yarn test:coverage

# Run unit tests with coverage (for CI)
yarn test:unit

# Run all E2E tests
yarn test:e2e

# Run E2E tests on specific browser
yarn test:e2e:chromium
yarn test:e2e:firefox
yarn test:e2e:webkit

# Run E2E tests on mobile devices
yarn test:e2e:mobile

# Run E2E tests in headed mode (see browser)
yarn test:e2e:headed

# Run E2E tests in debug mode
yarn test:e2e:debug

# Run visual regression tests
yarn test:visual

# Update visual regression baselines
yarn test:visual:update

# Run all tests (unit + E2E)
yarn test:all

# View Playwright HTML report
yarn playwright:report
```

### Running Specific Tests

```bash
# Run tests in a specific file
yarn test tests/unit/utils/general/general.utils.test.ts

# Run tests matching a pattern
yarn test --grep "Button"

# Run E2E tests for specific spec
yarn test:e2e dashboard.spec.ts
```

---

## Writing Tests

### Unit Tests

Test individual functions and utilities in isolation.

**Example**: Testing utility functions

```typescript
// tests/unit/utils/general/general.utils.test.ts
import { isValidURL } from "@/utils/general.utils";
import { describe, expect, it } from "vitest";

describe("isValidURL", () => {
  it("should return true for valid URLs", () => {
    expect(isValidURL("https://example.com")).toBe(true);
  });

  it("should return false for invalid URLs", () => {
    expect(isValidURL("not a url")).toBe(false);
  });
});
```

### Component Tests

Test React components using React Testing Library.

**Example**: Testing a button component

```typescript
// tests/components/atoms/GeneralButton/GeneralButton.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import GeneralButton from '@/components/atoms/buttons/GeneralButton';

describe('GeneralButton', () => {
  it('should call onAction when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithProviders(
      <GeneralButton label="Click Me" onAction={handleClick} />
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Test Redux actions, API routes, and database operations.

**Example**: Testing Redux actions

```typescript
// tests/integration/store/actions/classActions/classActions.test.ts
import { getClasses } from "@/store/actions/classActions";
import { beforeEach, describe, expect, it } from "vitest";

import { server } from "../../../mocks/server";
import { createMockStore } from "../../../utils/test-utils";

describe("classActions", () => {
  it("should fetch classes successfully", async () => {
    const store = createMockStore();

    await store.dispatch(getClasses());

    const state = store.getState();
    expect(state.class.classes.length).toBeGreaterThan(0);
  });
});
```

### E2E Tests

Test complete user workflows using Playwright.

**Example**: Testing dashboard

```typescript
// tests/e2e/admin/dashboard/dashboard.spec.ts
import { expect, test } from "@playwright/test";

test("should load dashboard successfully", async ({ page }) => {
  await page.goto("/admin/dashboard");

  await expect(page).toHaveTitle(/Digital Student Registration/i);

  const mainContent = page.locator("main");
  await expect(mainContent).toBeVisible();
});
```

### Visual Regression Tests

Capture and compare screenshots to detect visual changes.

```typescript
// tests/visual/pages/admin-dashboard.visual.spec.ts
import { expect, test } from "@playwright/test";

test("dashboard should match screenshot", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("dashboard.png");
});
```

---

## Test Utilities

### `renderWithProviders`

Renders components with all necessary providers (Redux, Theme, i18n, Router).

```typescript
import { renderWithProviders } from '../../utils/test-utils';

const { store } = renderWithProviders(<YourComponent />);
```

### `createMockStore`

Creates a Redux store with optional preloaded state.

```typescript
import { createMockStore } from "../../utils/test-utils";

const store = createMockStore({
  ui: { theme: "dark", locale: "en" },
});
```

### Mock Data Factories

Generate realistic mock data for tests.

```typescript
import {
  createMockClass,
  createMockDashboardStats,
  createMockStudent,
} from "../../utils/factories";

const student = createMockStudent({ firstName: "John" });
const classItem = createMockClass({ grade: 10 });
const stats = createMockDashboardStats();
```

### MSW Handlers

Mock API requests in tests.

```typescript
import { errorHandlers } from "../../mocks/handlers";
import { server } from "../../mocks/server";

// Use error handler for specific test
server.use(errorHandlers.studentsGetError);
```

---

## Coverage

### Viewing Coverage Reports

After running `yarn test:coverage`, open the HTML report:

```bash
# Coverage report is generated in ./coverage directory
open coverage/index.html
```

### Coverage Thresholds

Minimum coverage requirements (enforced in CI):

- **Statements**: 60%
- **Branches**: 60%
- **Functions**: 60%
- **Lines**: 60%

### Coverage Targets by Category

- **Utilities**: 90%
- **Validation**: 85%
- **Redux Reducers**: 80%
- **API Routes**: 80%
- **Models**: 85%
- **Components - Atoms**: 75%
- **Components - Molecules**: 70%
- **Components - Organisms**: 65%
- **Services**: 75%

---

## CI/CD Integration

Tests run automatically on GitHub Actions for every push and pull request.

### Workflow Jobs

1. **Unit & Integration Tests**
   - Runs Vitest with coverage
   - Uploads coverage to Codecov
   - Fails if coverage drops below 60%

2. **E2E Tests**
   - Runs Playwright tests on Chrome, Firefox, Safari
   - Uploads test artifacts (screenshots, videos)
   - Runs against real MongoDB instance

3. **Visual Regression Tests**
   - Captures screenshots
   - Compares with baseline
   - Uploads visual diffs on failure

4. **Lint & Type Check**
   - Runs ESLint
   - Runs TypeScript type checking

5. **Test Summary**
   - Aggregates all test results
   - Fails build if any test suite fails

### Local CI Simulation

Run all checks locally before pushing:

```bash
yarn lint
yarn test:all
```

---

## Best Practices

### Writing Good Tests

1. **Follow AAA Pattern**: Arrange, Act, Assert

   ```typescript
   it("should do something", () => {
     // Arrange: Set up test data
     const data = createMockStudent();

     // Act: Perform action
     const result = processStudent(data);

     // Assert: Verify result
     expect(result).toBe(expected);
   });
   ```

2. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Avoid testing internal state or implementation details

3. **Use Descriptive Test Names**

   ```typescript
   // Good
   it("should disable submit button when form is invalid", () => {});

   // Bad
   it("should work", () => {});
   ```

4. **Keep Tests Independent**
   - Each test should run independently
   - Don't rely on test execution order
   - Clean up after each test (handled automatically)

5. **Mock External Dependencies**
   - Use MSW for API requests
   - Mock external libraries when needed
   - Use test factories for data generation

6. **Test Edge Cases**
   - Empty states
   - Error states
   - Boundary values
   - Loading states

### Component Testing Best Practices

1. **Query by Accessible Roles**

   ```typescript
   // Preferred
   screen.getByRole("button", { name: "Submit" });

   // Avoid
   screen.getByTestId("submit-button");
   ```

2. **Simulate Real User Interactions**

   ```typescript
   const user = userEvent.setup();
   await user.click(screen.getByRole("button"));
   await user.type(screen.getByRole("textbox"), "Hello");
   ```

3. **Wait for Async Operations**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText("Success")).toBeInTheDocument();
   });
   ```

### E2E Testing Best Practices

1. **Use Stable Selectors**
   - Prefer `getByRole`, `getByLabel`, `getByText`
   - Use `data-testid` as last resort

2. **Wait for Page Load**

   ```typescript
   await page.waitForLoadState("networkidle");
   ```

3. **Test Critical User Paths**
   - Happy path (successful flow)
   - Error scenarios
   - Edge cases

4. **Keep E2E Tests Focused**
   - One scenario per test
   - Avoid testing implementation details

---

## Troubleshooting

### Common Issues

#### Tests Timing Out

```bash
# Increase timeout in vitest.config.ts
testTimeout: 20000
```

#### Playwright Browser Not Found

```bash
# Reinstall browsers
yarn playwright:install
```

#### Mock Service Worker Not Working

```bash
# Ensure server is started in setup.ts
# Check that handlers are registered correctly
```

#### Component Not Rendering

```typescript
// Ensure you're using renderWithProviders
renderWithProviders(<YourComponent />);

// Not just render from RTL
```

#### Type Errors in Tests

```bash
# Ensure TypeScript includes test files
# Check tsconfig.json includes: ["**/*.test.ts", "**/*.test.tsx"]
```

### Debugging Tests

#### Debug Unit/Component Tests

```bash
# Run tests with --inspect flag
node --inspect-brk node_modules/.bin/vitest

# Or use Vitest UI
yarn test:ui
```

#### Debug E2E Tests

```bash
# Run in headed mode
yarn test:e2e:headed

# Run in debug mode (pauses execution)
yarn test:e2e:debug
```

#### View Test Output

```bash
# Vitest shows console.log output by default

# Playwright saves videos and screenshots on failure
# Check: test-results/ directory
```

### Getting Help

- Check [Vitest docs](https://vitest.dev/)
- Check [Playwright docs](https://playwright.dev/)
- Check [Testing Library docs](https://testing-library.com/)
- Review existing tests in `tests/` directory

---

## Next Steps

### Implementing the Test Plan

Follow the comprehensive test plan outlined in the project to implement tests for:

1. **Phase 1**: Already completed - Setup & Configuration ✅
2. **Phase 2**: Unit Tests (~300 tests) - Utilities, validation, reducers, services
3. **Phase 3**: Component Tests (~250 tests) - Atoms, molecules, organisms
4. **Phase 4**: Integration Tests (~150 tests) - Actions, API routes, models
5. **Phase 5**: E2E Tests (~80 tests) - User workflows, navigation, accessibility
6. **Phase 6**: Visual Regression (~50 snapshots) - Components, pages, responsive

### Priority Order

1. Start with unit tests (highest ROI, easiest to write)
2. Then component tests for critical UI elements
3. Integration tests for Redux actions and API routes
4. E2E tests for critical user paths
5. Visual regression tests for UI consistency

---

## Summary

You now have a complete testing infrastructure with:

- ✅ Vitest for unit/integration tests
- ✅ React Testing Library for component tests
- ✅ Playwright for E2E tests
- ✅ MSW for API mocking
- ✅ Test utilities and factories
- ✅ CI/CD integration with GitHub Actions
- ✅ Coverage reporting
- ✅ Example tests to follow
