# Testing Documentation

Testing guide for Digital Student Registration.

## Overview

**Unit Tests:** Vitest (964+ tests)
**E2E Tests:** Playwright (98+ tests)
**Coverage Target:** 60-80%

---

## Tech Stack

- **Vitest** - Fast unit/integration test runner
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (Chromium, Firefox, WebKit)
- **MSW** - API mocking
- **mongodb-memory-server** - In-memory MongoDB

---

## Running Tests

### Unit Tests

```bash
# All tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:coverage

# Specific file
yarn test path/to/file.test.ts
```

### E2E Tests

```bash
# Install browsers (first time only)
yarn playwright:install

# Run E2E tests (Chromium only, fastest)
yarn test:e2e:chromium

# Run E2E tests (all browsers)
yarn test:e2e

# Run specific test
yarn test:e2e dashboard.spec.ts
```

### All Tests

```bash
# Run both unit and E2E tests
yarn test:all
```

---

## Writing Unit Tests

### Component Tests

```typescript
import { renderWithProviders } from '@/tests/utils/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<MyComponent onClick={onClick} />);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Redux Actions

```typescript
import { getClasses } from "@/store/actions/classActions";
import { GET_CLASSES_SUCCESS } from "@/store/types";
import { createMockStore } from "@/tests/utils/test-utils";

describe("classActions", () => {
  it("fetches classes successfully", async () => {
    const store = createMockStore();
    await store.dispatch(getClasses());

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({ type: GET_CLASSES_SUCCESS }),
    );
  });
});
```

### Utility Functions

```typescript
import { formatDate } from "@/utils/date.utils";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = new Date("2024-01-01");
    expect(formatDate(date)).toBe("01.01.2024");
  });
});
```

---

## Writing E2E Tests

### Basic Test

```typescript
import { expect, test } from "@playwright/test";

test("should login successfully", async ({ page }) => {
  await page.goto("/login");

  await page.fill('[name="email"]', "test@test.de");
  await page.fill('[name="password"]', "password");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/admin/dashboard");
});
```

### With Setup

```typescript
import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[name="email"]', "test@test.de");
    await page.fill('[name="password"]', "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin/dashboard");
  });

  test("should display stats", async ({ page }) => {
    await expect(page.getByText("Total Students")).toBeVisible();
  });
});
```

---

## Test Utilities

### renderWithProviders

Render components with Redux, Theme, i18n, and Router:

```typescript
import { renderWithProviders } from '@/tests/utils/test-utils';

const { store, ...utils } = renderWithProviders(<MyComponent />, {
  preloadedState: { /* custom initial state */ }
});
```

### createMockStore

Create Redux store for testing:

```typescript
import { createMockStore } from "@/tests/utils/test-utils";

const store = createMockStore({
  student: { students: [] },
  class: { classes: [] },
});
```

### Mock Data

```typescript
import { createMockClass, createMockStudent } from "@/tests/mocks/data";

const student = createMockStudent({ firstName: "John" });
const classData = createMockClass({ name: "10A" });
```

---

## MSW (Mock Service Worker)

### Setup

MSW handlers are in `tests/mocks/handlers.ts`:

```typescript
import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/classes", () => {
    return HttpResponse.json({
      docs: [{ _id: "1", name: "10A" }],
      totalDocs: 1,
    });
  }),

  http.post("/api/students", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: body });
  }),
];
```

### Use in Tests

```typescript
import { server } from "@/tests/mocks/server";
import { HttpResponse, http } from "msw";

it("handles API error", async () => {
  // Override handler for this test
  server.use(
    http.get("/api/classes", () => {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }),
  );

  // Test error handling
  const store = createMockStore();
  await store.dispatch(getClasses());

  const actions = store.getActions();
  expect(actions).toContainEqual(
    expect.objectContaining({ type: GET_CLASSES_FAILURE }),
  );
});
```

---

## Best Practices

### Component Testing

✅ Use `renderWithProviders()` instead of `render()`
✅ Use `screen.getByRole()` for accessibility
✅ Use `userEvent` instead of `fireEvent`
✅ Test user behavior, not implementation
✅ Keep tests simple and focused

❌ Don't test implementation details
❌ Don't mock too much
❌ Don't use `act()` manually (testing-library handles it)

### E2E Testing

✅ Test critical user paths
✅ Use data-testid sparingly (prefer semantic queries)
✅ Wait for navigation/animations
✅ Test across different viewports

❌ Don't test every edge case
❌ Don't repeat unit test scenarios
❌ Don't use arbitrary timeouts

---

## Coverage

### View Coverage

```bash
yarn test:coverage
```

### Coverage Reports

- **Terminal:** Summary in console
- **HTML:** `coverage/index.html`
- **LCOV:** `coverage/lcov.info`

### Coverage Thresholds

```javascript
// vitest.config.ts
coverage: {
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

---

## Debugging Tests

### Vitest

```bash
# Run tests in UI mode
yarn test --ui

# Debug specific test
yarn test --inspect-brk path/to/test.ts
```

### Playwright

```bash
# Run in headed mode
yarn test:e2e:chromium --headed

# Debug mode
yarn test:e2e:chromium --debug

# View trace
yarn playwright show-trace trace.zip
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: yarn test

- name: E2E tests
  run: |
    yarn playwright:install
    yarn test:e2e

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## Troubleshooting

### Tests Failing Randomly

- Ensure proper cleanup in `afterEach`
- Check for shared state between tests
- Use `waitFor()` for async operations

### MSW Not Working

- Ensure server is started in `setupTests.ts`
- Check handler URLs match API calls
- Verify request method (GET/POST/etc.)

### Playwright Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Ensure dev server is running
- Check for infinite loading states

---

## Additional Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [MSW Docs](https://mswjs.io/)
