# Component Development Guide

Component development using Atomic Design pattern.

## Overview

**Pattern:** Atomic Design (Atoms → Molecules → Organisms)
**Styling:** Material-UI `styled()` API with Emotion
**Testing:** Vitest + React Testing Library
**Location:** `src/components/`

---

## Structure

```
src/components/
├── atoms/          # Basic UI elements (buttons, inputs, badges)
├── molecules/      # Composed components (headers, menus)
└── organisms/      # Complex features (forms, tables, modals)
```

**Naming:** PascalCase (`GeneralButton`, `DataTable`)
**Export:** Via `index.tsx` in each directory

---

## Atomic Design

### Atoms

Basic building blocks. Cannot be broken down further.

**Examples:**

- `GeneralButton` - Reusable button with variants
- `GeneralInput` - Text input with error states
- `ClassStatus` - Status badge
- `Logo` - Application logo

### Molecules

Composed of atoms. Still relatively simple.

**Examples:**

- `AdminSettingsHeader` - Header with title + actions
- `StatCard` - Dashboard statistic card
- `AccessibilityMenu` - Accessibility settings menu

### Organisms

Complex features combining atoms and molecules.

**Examples:**

- **Forms** - 10 onboarding forms (WelcomeForm, GeneralForm, etc.)
- **Tables** - DataTable with sorting, filtering, pagination
- **Modals** - GeneralModal, AddClassModal, AddStudentModal
- **Navigation** - LeftNavigation with collapsible sections

---

## Creating Components

### 1. Basic Component

```typescript
// src/components/atoms/MyComponent/index.tsx
'use client';  // If using hooks/state

import { styled } from '@mui/material';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const StyledWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,

  // Responsive
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },

  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    border: `1px solid ${theme.palette.divider}`,
  }),
}));

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <StyledWrapper onClick={onClick}>
      {title}
    </StyledWrapper>
  );
}
```

### 2. Test File

```typescript
// src/components/atoms/MyComponent/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/tests/utils/test-utils';
import MyComponent from './index';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<MyComponent title="Test" onClick={onClick} />);
    await user.click(screen.getByText('Test'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Export from Index

```typescript
// src/components/atoms/index.ts
export { default as MyComponent } from "./MyComponent";
export { default as GeneralButton } from "./GeneralButton";
// ...
```

---

## Best Practices

### Component Guidelines

✅ **Use TypeScript** - Always define prop interfaces
✅ **Use `'use client'`** - When using hooks/state/events
✅ **Use Material-UI** - Leverage theme system
✅ **Responsive Design** - Use `theme.breakpoints`
✅ **Dark Mode** - Support both themes
✅ **Accessibility** - Proper ARIA labels, semantic HTML
✅ **Test Coverage** - Write tests for all components

❌ **Don't use `any`** - Use proper types
❌ **Don't hardcode colors** - Use theme
❌ **Don't use inline styles** - Use `styled()` or `sx` prop
❌ **Don't forget cleanup** - Clean up effects/listeners

### Styling Patterns

**Styled Components:**

```typescript
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
}));
```

**sx Prop (one-off styles):**

```typescript
<Box sx={{ padding: 2, backgroundColor: 'background.paper' }}>
  Content
</Box>
```

**Conditional Styling:**

```typescript
const StyledCard = styled(Card)(({ theme }) => ({
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
  }),
}));
```

---

## Common Patterns

### Forms

```typescript
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function MyForm() {
  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <TextField name="name" label="Name" fullWidth />
        <TextField name="email" label="Email" fullWidth />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  );
}
```

### Modals

```typescript
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MyModal({ open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Title</DialogTitle>
      <DialogContent>Content</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Tables

```typescript
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
];

export default function MyTable({ rows }) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={20}
      autoHeight
    />
  );
}
```

---

## Theme Access

```typescript
import { useTheme } from '@mui/material';

export default function MyComponent() {
  const theme = useTheme();

  return (
    <div style={{ color: theme.palette.primary.main }}>
      Themed content
    </div>
  );
}
```

---

## Internationalization

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return <div>{t('common.welcome')}</div>;
}
```

---

## Testing

### With Providers

```typescript
import { renderWithProviders } from '@/tests/utils/test-utils';
import { screen } from '@testing-library/react';
import MyComponent from './index';

it('renders with Redux/Theme/Router', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

### User Events

```typescript
import userEvent from '@testing-library/user-event';

it('handles click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button onClick={onClick}>Click</Button>);
  await user.click(screen.getByText('Click'));

  expect(onClick).toHaveBeenCalled();
});
```

### Custom Hooks

```typescript
import { renderHook } from "@testing-library/react";

import { useMyHook } from "./useMyHook";

it("returns correct value", () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current).toBe(expected);
});
```

---

## Component Examples

### Button Component

```typescript
// src/components/atoms/GeneralButton/index.tsx
'use client';

import { Button, ButtonProps, styled } from '@mui/material';

interface GeneralButtonProps extends ButtonProps {
  loading?: boolean;
}

const StyledButton = styled(Button)<{ loading?: boolean }>(({ theme, loading }) => ({
  position: 'relative',
  opacity: loading ? 0.7 : 1,
  pointerEvents: loading ? 'none' : 'auto',
}));

export default function GeneralButton({
  children,
  loading,
  ...props
}: GeneralButtonProps) {
  return (
    <StyledButton loading={loading} {...props}>
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
}
```

### Data Table Component

```typescript
// src/components/organisms/DataTable/index.tsx
'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

export default function DataTable({
  rows,
  columns,
  loading,
  onRowClick
}: DataTableProps) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      onRowClick={onRowClick}
      pageSize={20}
      pageSizeOptions={[20, 50, 100]}
      autoHeight
      disableRowSelectionOnClick
    />
  );
}
```

---

## Additional Resources

- [Material-UI Docs](https://mui.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [React Testing Library](https://testing-library.com/react)
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
