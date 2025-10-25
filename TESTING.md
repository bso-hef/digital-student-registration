# Testing Guide

This document provides comprehensive guidance on testing the Digital Student Registration application.

## Table of Contents

1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Unit Testing (Vitest)](#unit-testing-vitest)
4. [E2E Testing (Playwright)](#e2e-testing-playwright)
5. [Visual Regression Testing](#visual-regression-testing)
6. [Running Tests](#running-tests)
7. [Writing Tests](#writing-tests)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The project uses a comprehensive testing strategy with three layers:

- **Unit Tests**: Vitest for component and function testing (964 tests)
- **E2E Tests**: Playwright for end-to-end user flow testing (98 tests)
- **Visual Regression**: Playwright snapshots for UI consistency (30+ snapshots)

### Test Coverage Summary

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

---

## Test Structure

```
project-root/
├── tests/
│   ├── unit/                       # Vitest unit tests
│   │   ├── components/
│   │   │   ├── atoms/             # 723 tests
│   │   │   ├── molecules/         # 106 tests
│   │   │   └── organisms/         # 135 tests
│   │   └── utils/                 # Utility function tests
│   └── e2e/                        # Playwright E2E tests
│       ├── admin/
│       │   ├── dashboard/
│       │   ├── management/
│       │   └── settings/
│       └── student/
│           └── onboarding/
├── vitest.config.ts               # Vitest configuration
├── playwright.config.ts           # Playwright configuration
└── PLAYWRIGHT_TESTING.md          # Detailed Playwright guide
```

---

## Unit Testing (Vitest)

### Configuration

Located in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Running Unit Tests

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run tests with UI
yarn test:ui
```

### Writing Unit Tests

**Component Test Example:**

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GeneralButton from '@/components/atoms/buttons/GeneralButton';

describe('GeneralButton', () => {
  it('renders button with text', () => {
    render(<GeneralButton>Click Me</GeneralButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<GeneralButton onClick={handleClick}>Click</GeneralButton>);

    const button = screen.getByText('Click');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Utility Test Example:**

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/date.utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15');
  });
});
```

### Test Patterns

1. **Arrange-Act-Assert (AAA)**
   ```typescript
   it('should add two numbers', () => {
     // Arrange
     const a = 5;
     const b = 3;

     // Act
     const result = add(a, b);

     // Assert
     expect(result).toBe(8);
   });
   ```

2. **Test Isolation**
   - Each test should be independent
   - Use `beforeEach` to reset state
   - Mock external dependencies

3. **Descriptive Names**
   - Use `describe` blocks to group related tests
   - Name tests with "should" statements

---

## E2E Testing (Playwright)

### Configuration

Located in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'https://localhost:3000',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] },
    { name: 'Tablet', use: devices['iPad Pro'] },
  ],
});
```

### Running E2E Tests

```bash
# Prerequisites
yarn dev                           # Start dev server
yarn playwright:install            # Install browsers (first time)

# Run all E2E tests
yarn test:e2e

# Run specific browser
yarn test:e2e:chromium
yarn test:e2e:firefox
yarn test:e2e:webkit

# Run mobile tests
yarn test:e2e:mobile

# Run in headed mode (see browser)
yarn test:e2e:headed

# Run in debug mode
yarn test:e2e:debug

# View test report
yarn playwright show-report
```

### E2E Test Structure

**Test File Example:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard stats', async ({ page }) => {
    const statsContainer = page.locator('[data-testid="stats"]');
    await expect(statsContainer).toBeVisible();
  });

  test('should navigate to classes', async ({ page }) => {
    const classesLink = page.locator('a[href*="/classes"]');
    await classesLink.click();
    await page.waitForURL('**/classes**');
    expect(page.url()).toContain('classes');
  });
});
```

---

## Visual Regression Testing

### Overview

Visual regression testing captures screenshots of the UI and compares them against baseline images to detect unintended visual changes.

### Snapshot Strategy

```
**/*-snapshots/                    # All snapshot folders
├── baseline-image.png             # ✅ Committed to Git
├── baseline-image-actual.png      # ❌ Ignored (test failures)
└── baseline-image-diff.png        # ❌ Ignored (test failures)
```

### Generating Baseline Snapshots

```bash
# Generate baselines for all browsers
yarn playwright test --update-snapshots

# Generate for specific browser
yarn playwright test --update-snapshots --project=chromium

# Generate for specific test file
yarn playwright test --update-snapshots tests/e2e/admin/dashboard/dashboard.spec.ts
```

### Visual Test Example

```typescript
test.describe('Visual Regression', () => {
  test('should match dashboard screenshot', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations

    await expect(page).toHaveScreenshot('dashboard-full-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
```

### Snapshot Configuration

In `playwright.config.ts`:

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,      // Allow up to 100 pixels difference
    threshold: 0.2,          // 20% threshold for pixel comparison
  },
}
```

### Updating Snapshots

When you intentionally change the UI:

```bash
# Review changes first
yarn playwright test

# Update if changes are intentional
yarn playwright test --update-snapshots

# ⚠️ ALWAYS review updated snapshots before committing!
```

---

## Running Tests

### Quick Reference

```bash
# Unit Tests
yarn test                          # Run all unit tests
yarn test:watch                    # Watch mode
yarn test:coverage                 # With coverage
yarn test:ui                       # Interactive UI

# E2E Tests
yarn test:e2e                      # All E2E tests
yarn test:e2e:chromium            # Chromium only
yarn test:e2e:firefox             # Firefox only
yarn test:e2e:webkit              # WebKit only
yarn test:e2e:mobile              # Mobile browsers
yarn test:e2e:headed              # Show browser
yarn test:e2e:debug               # Debug mode

# Visual Regression
yarn test:visual                   # Run visual tests
yarn test:visual:update           # Update snapshots

# All Tests
yarn test:all                      # Unit + E2E

# View Reports
yarn playwright show-report       # Playwright HTML report
```

### Test Workflow

1. **Start Development Server**
   ```bash
   yarn dev
   ```

2. **Run Tests**
   ```bash
   # Unit tests (fast feedback)
   yarn test:watch

   # E2E tests (after major changes)
   yarn test:e2e:chromium
   ```

3. **Review Results**
   ```bash
   # Unit test coverage
   open coverage/index.html

   # E2E test report
   yarn playwright show-report
   ```

4. **Update Snapshots (if needed)**
   ```bash
   yarn playwright test --update-snapshots
   ```

---

## Writing Tests

### Unit Test Guidelines

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good: Tests behavior
   it('should display error message when form is invalid', () => {
     render(<LoginForm />);
     fireEvent.submit(screen.getByRole('button'));
     expect(screen.getByText(/error/i)).toBeVisible();
   });

   // ❌ Bad: Tests implementation
   it('should set error state to true', () => {
     const { result } = renderHook(() => useForm());
     result.current.setError(true);
     expect(result.current.error).toBe(true);
   });
   ```

2. **Use Testing Library Queries**
   ```typescript
   // ✅ Prefer user-centric queries
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText(/email/i);
   screen.getByText(/welcome/i);

   // ❌ Avoid implementation details
   screen.getByClassName('submit-button');
   screen.getByTestId('email-input');
   ```

3. **Mock External Dependencies**
   ```typescript
   import { vi } from 'vitest';
   import { api } from '@/lib/services/api';

   vi.mock('@/lib/services/api');

   it('should fetch user data', async () => {
     api.get.mockResolvedValue({ data: { name: 'John' } });
     // Test component using api
   });
   ```

### E2E Test Guidelines

1. **Use Page Object Model**
   ```typescript
   class DashboardPage {
     constructor(private page: Page) {}

     async navigate() {
       await this.page.goto('/admin/dashboard');
       await this.page.waitForLoadState('networkidle');
     }

     async clickClassesLink() {
       await this.page.locator('a[href*="/classes"]').click();
     }
   }

   test('should navigate to classes', async ({ page }) => {
     const dashboard = new DashboardPage(page);
     await dashboard.navigate();
     await dashboard.clickClassesLink();
     expect(page.url()).toContain('classes');
   });
   ```

2. **Wait for Stability**
   ```typescript
   // Wait for network to be idle
   await page.waitForLoadState('networkidle');

   // Wait for specific element
   await page.waitForSelector('[data-testid="content"]');

   // Wait for URL change
   await page.waitForURL('**/dashboard**');
   ```

3. **Handle Asynchronous Operations**
   ```typescript
   // Wait for async data loading
   await page.waitForTimeout(2000);

   // Or wait for specific state
   await expect(page.locator('[data-testid="stats"]')).toBeVisible({
     timeout: 10000
   });
   ```

### Visual Test Guidelines

1. **Consistent Timing**
   ```typescript
   // Wait for animations to complete
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(1000);

   // Disable animations
   await expect(page).toHaveScreenshot('name.png', {
     animations: 'disabled',
   });
   ```

2. **Mask Dynamic Content**
   ```typescript
   await expect(page).toHaveScreenshot('dashboard.png', {
     mask: [
       page.locator('.timestamp'),
       page.locator('.dynamic-id'),
     ],
   });
   ```

3. **Test Multiple Viewports**
   ```typescript
   test.describe('Responsive Design', () => {
     test('mobile', async ({ page }) => {
       await page.setViewportSize({ width: 375, height: 667 });
       await expect(page).toHaveScreenshot('mobile.png');
     });

     test('tablet', async ({ page }) => {
       await page.setViewportSize({ width: 768, height: 1024 });
       await expect(page).toHaveScreenshot('tablet.png');
     });
   });
   ```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"

      - name: Install dependencies
        run: yarn install

      - name: Run unit tests
        run: yarn test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"

      - name: Install dependencies
        run: yarn install

      - name: Install Playwright
        run: yarn playwright install --with-deps

      - name: Run E2E tests
        run: yarn test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "yarn test:unit && yarn lint",
      "pre-push": "yarn test:all"
    }
  }
}
```

---

## Best Practices

### General

1. **Test Pyramid**
   - Many unit tests (fast, isolated)
   - Fewer E2E tests (slow, realistic)
   - Critical path coverage with visual tests

2. **Test Independence**
   - Each test should run independently
   - No shared state between tests
   - Use `beforeEach` for setup

3. **Descriptive Names**
   ```typescript
   // ✅ Good
   test('should display error message when email is invalid')

   // ❌ Bad
   test('test1')
   ```

4. **Arrange-Act-Assert**
   ```typescript
   test('should...', () => {
     // Arrange: Setup
     const user = createUser();

     // Act: Execute
     const result = user.login();

     // Assert: Verify
     expect(result).toBe(true);
   });
   ```

### Unit Tests

1. **Mock Appropriately**
   - Mock external dependencies
   - Don't mock what you're testing
   - Use real implementations when possible

2. **Test Edge Cases**
   - Empty states
   - Error conditions
   - Boundary values

3. **Keep Tests Fast**
   - Avoid real network calls
   - Minimize DOM operations
   - Use fake timers

### E2E Tests

1. **Test User Journeys**
   - Focus on critical paths
   - Test realistic scenarios
   - Cover main user flows

2. **Avoid Test Data Dependencies**
   - Create test data in tests
   - Clean up after tests
   - Don't rely on external data

3. **Handle Flakiness**
   - Use proper waits
   - Retry on CI (configured automatically)
   - Investigate failures

### Visual Tests

1. **Review All Changes**
   - Always review snapshot diffs
   - Update intentionally
   - Document why changes were made

2. **Keep Snapshots Stable**
   - Disable animations
   - Mask dynamic content
   - Wait for stable state

3. **Test Critical Views**
   - Landing pages
   - Main dashboards
   - Complex forms

---

## Troubleshooting

### Common Issues

#### Unit Tests

**Issue**: `Cannot find module '@/components/...'`

**Solution**: Check `tsconfig.json` and `vitest.config.ts` path aliases

```typescript
// vitest.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Issue**: `ReferenceError: fetch is not defined`

**Solution**: Install and configure node-fetch or use happy-dom environment

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
});
```

#### E2E Tests

**Issue**: `Port 3000 is in use`

**Solution**: Kill existing process or use existing server

```bash
# Option 1: Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Start server manually and set reuseExistingServer
yarn dev
```

**Issue**: `Browser executable not found`

**Solution**: Install Playwright browsers

```bash
yarn playwright:install
```

**Issue**: `Timeout waiting for element`

**Solution**: Increase timeout or improve selectors

```typescript
// Increase timeout
await expect(element).toBeVisible({ timeout: 10000 });

// Better selector
page.locator('[data-testid="specific-element"]')
```

#### Visual Tests

**Issue**: Snapshot mismatch

**Solution**: Review changes and update if intentional

```bash
# View diff in report
yarn playwright show-report

# Update if changes are correct
yarn playwright test --update-snapshots
```

**Issue**: Flaky visual tests

**Solution**: Improve stability

```typescript
// Wait longer for animations
await page.waitForTimeout(2000);

// Disable animations
await expect(page).toHaveScreenshot('name.png', {
  animations: 'disabled',
});

// Mask dynamic content
await expect(page).toHaveScreenshot('name.png', {
  mask: [page.locator('.timestamp')],
});
```

### Debug Commands

```bash
# Debug specific test
yarn test:e2e:debug tests/e2e/admin/dashboard/dashboard.spec.ts

# Run with trace
yarn playwright test --trace on

# Show trace viewer
yarn playwright show-trace trace.zip

# Screenshot on each action
yarn playwright test --screenshot on

# Slow down execution
yarn playwright test --slow-mo=1000
```

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [PLAYWRIGHT_TESTING.md](./PLAYWRIGHT_TESTING.md) - Detailed Playwright guide

---

## Summary

This project maintains high test coverage across multiple layers:

- **964 unit tests** covering components and utilities
- **98 E2E tests** covering user flows and critical paths
- **30+ visual snapshots** ensuring UI consistency

**Key Commands:**
```bash
# Development
yarn test:watch              # Unit tests in watch mode
yarn test:e2e:headed        # E2E tests with browser visible

# CI/CD
yarn test:all                # All tests
yarn test:coverage           # Coverage report

# Maintenance
yarn playwright test --update-snapshots  # Update visual baselines
yarn playwright show-report              # View test results
```

Always run tests before committing and review all snapshot changes!
