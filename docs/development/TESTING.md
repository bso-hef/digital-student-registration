# Testing Documentation

Testing guide for Digital Student Registration.

## Overview

**Unit Tests:** Vitest — ~2070 tests across 76 test files
**Environment:** jsdom
**Coverage Thresholds:** auto-updating (see [Coverage](#coverage))

> Integration tests exist under `tests/integration/` but are currently
> **excluded** from the Vitest run (see [Integration Tests](#integration-tests)).
> Only the `unit` project runs.

---

## Tech Stack

- **Vitest** - Fast unit test runner (jsdom environment)
- **React Testing Library** - Component testing
- **MSW** - API mocking (used by integration setup, not unit tests)
- **mongodb-memory-server** - In-memory MongoDB (integration tests)

---

## Running Tests

### Unit Tests

```bash
# Watch mode (default `test` script)
yarn test

# Run once with coverage
yarn test:unit

# Explicit watch mode
yarn test:watch

# Interactive UI
yarn test:ui

# Coverage (alias of test:unit)
yarn test:coverage

# Type-check only
yarn test:ts

# Run everything (alias of test:unit — unit tests only)
yarn test:all
```

> `yarn test` runs Vitest in **watch mode** and does not exit on its own.
> For a single run (e.g. in CI or pre-commit), use `yarn test:unit`.

To run a specific file in watch mode, pass a path filter:

```bash
yarn test path/to/file.test.ts
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

## Integration Tests

Integration tests live under `tests/integration/` and use
`tests/integration.setup.ts` (which configures the MSW server lifecycle and
mongodb-memory-server).

They are **currently disabled** in `vitest.config.ts`:

- `tests/**/integration/**` is listed in the `exclude` patterns.
- The dedicated `integration` Vitest project is commented out (it has
  unresolved `@/` import-resolution issues and would need a separate runner or
  additional configuration).

As a result, `yarn test:unit` runs only the `unit` project — integration tests
do not run as part of the normal test command.

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

### Mock Data Factories

Factories live in `tests/utils/factories.ts` (note: `@/` maps to `src/`, so use
the `@/tests` alias for test files):

```typescript
import {
  createMockClass,
  createMockClasses,
  createMockDashboardStats,
  createMockPaginationResponse,
  createMockStudent,
  createMockStudents,
} from "@/tests/utils/factories";

const student = createMockStudent({ firstName: "John" });
const classData = createMockClass({ name: "10A" });
const students = createMockStudents(5);
const page = createMockPaginationResponse(students, { totalDocs: 5 });
```

Factory counters are reset automatically after each test (see
`resetFactoryCounters` in `tests/setup.ts`).

---

## MSW (Mock Service Worker)

MSW handlers and server live in `tests/mocks/handlers.ts` and
`tests/mocks/server.ts`.

> **Note:** MSW is **not** enabled for unit tests. The unit setup
> (`tests/setup.ts`) mocks `fetch` directly because MSW's browser worker needs
> Service Workers (unavailable in jsdom) and the node server targets a Node
> environment. The MSW server lifecycle is wired up in
> `tests/integration.setup.ts`, which is only used by the (currently disabled)
> integration tests.

### Handlers

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

### Mocking fetch in unit tests

Because unit tests mock `fetch` directly, override it per test:

```typescript
it("handles API error", async () => {
  (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({ error: "Server error" }),
  } as Response);

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

- Use `renderWithProviders()` instead of `render()`
- Use `screen.getByRole()` for accessibility
- Use `userEvent` instead of `fireEvent`
- Test user behavior, not implementation
- Keep tests simple and focused

Avoid:

- Testing implementation details
- Mocking too much
- Calling `act()` manually (testing-library handles it)

---

## Coverage

### View Coverage

```bash
yarn test:unit   # or yarn test:coverage (same script)
```

### Coverage Reports

- **Terminal:** Summary in console (`text` reporter)
- **HTML:** `coverage/index.html`
- **JSON:** `coverage/coverage-final.json`
- **LCOV:** `coverage/lcov.info`

### Coverage Thresholds

Thresholds are configured with `autoUpdate: true`, which means Vitest rewrites
them in `vitest.config.ts` whenever coverage increases, so they ratchet upward
over time. The current values are:

```javascript
// vitest.config.ts
coverage: {
  provider: "v8",
  thresholds: {
    autoUpdate: true,
    branches: 27.63,
    functions: 24.75,
    lines: 29.09,
    statements: 28.74,
  },
}
```

---

## Debugging Tests

### Vitest

```bash
# Interactive UI mode
yarn test:ui

# Debug a specific test (Node inspector)
yarn test --inspect-brk path/to/test.ts
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Type check
  run: yarn test:ts

- name: Run unit tests with coverage
  run: yarn test:unit

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

### fetch Mock Not Working

- Remember unit tests mock `fetch` directly (not MSW); set up the mock in the
  test or rely on the global `vi.fn()` in `tests/setup.ts`
- Use `mockResolvedValueOnce`/`mockResolvedValue` to return responses
- Verify the request URL and method match what the code calls

---

## Additional Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Docs](https://mswjs.io/)
