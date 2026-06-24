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
├── atoms/          # Basic UI elements, grouped into categorized subfolders
│   ├── buttons/    # GeneralButton, SmallIconButton
│   ├── inputs/     # Text/number/date inputs
│   ├── status/     # ClassStatus, StudentStatus, AuditStatus
│   ├── dashboard/  # StatCard, MetricLabel, HealthIndicator
│   ├── dropdowns/  # Dropdown/select atoms
│   ├── menus/      # Menu atoms
│   ├── auth/       # Auth-related atoms
│   └── ...         # Plus top-level atoms (GeneralInput, Logo, CustomTitle, etc.)
├── molecules/      # Composed components (headers, menus)
└── organisms/      # Complex features (forms, tables, modals)
    └── forms/      # Onboarding step forms (WelcomeForm, GeneralForm, etc.)
```

**Naming:** PascalCase (`GeneralButton`, `DataTable`)
**Export:** Via `index.tsx` in each directory

---

## Atomic Design

### Atoms

Basic building blocks. Cannot be broken down further.

**Examples:**

- `GeneralButton` (`atoms/buttons/GeneralButton`) - Reusable button with variants
- `GeneralInput` (`atoms/GeneralInput`) - Text input with error states
- `ClassStatus` (`atoms/status/ClassStatus`) - Status badge
- `StatCard` (`atoms/dashboard/StatCard`) - Dashboard statistic card
- `Logo` (`atoms/Logo`) - Application logo

### Molecules

Composed of atoms. Still relatively simple.

**Examples:**

- `AdminSettingsHeader` - Header with title + actions
- `AccessibilityMenu` - Accessibility settings menu

### Organisms

Complex features combining atoms and molecules.

**Examples:**

- **Forms** - 11 onboarding step forms rendered by `StepForm` (WelcomeForm, GeneralForm, OriginForm, AddressForm, ParentsForm, PreEducationForm, TrainingForm, CompanyContactForm, AgreementsForm, SummaryForm, FormCompletion); form components live under `organisms/forms/`
- **Tables** - DataTable with sorting, filtering, pagination
- **Modals** - GeneralModal, AddClassModal, AddStudentModal
- **Navigation** - LeftNavigation with collapsible sections

---

## Creating Components

### 1. Basic Component

```typescript
// src/components/atoms/buttons/MyComponent/index.tsx
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
// src/components/atoms/buttons/MyComponent/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// test-utils lives at the project root (tests/utils/test-utils.tsx).
// Import it via a relative path (depth depends on the component's location).
import { renderWithProviders } from '../../../../../tests/utils/test-utils';
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

### 3. Import the Component

There is no flat `atoms` barrel file. Each component is exported as the
default export of its own `index.tsx` and imported directly by its full path:

```typescript
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import StatCard from "@/components/atoms/dashboard/StatCard";
import DataTable from "@/components/organisms/tables/DataTable";
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

Tables are built on the MUI core `Table` primitives (not `@mui/x-data-grid`,
which is not a dependency). Use the existing `DataTable` organism: pass a
`headers` array and a `data` array of row records.

```typescript
import DataTable from '@/components/organisms/tables/DataTable';

const headers = [
  { id: 'name', label: 'Name', align: 'left', clickable: true },
  { id: 'status', label: 'Status', align: 'center' },
];

const data = [
  { id: 1, name: 'Alice', status: 'Active' },
  { id: 2, name: 'Bob', status: 'Inactive' },
];

export default function MyTable() {
  return (
    <DataTable
      headers={headers}
      data={data}
      onClickRowItem={(id) => console.log('row', id)}
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
// test-utils lives at the project root (tests/utils/test-utils.tsx),
// imported via a relative path from the test file.
import { renderWithProviders } from '../../../../../tests/utils/test-utils';
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
// src/components/atoms/buttons/GeneralButton/index.tsx
import React from "react";

import { Button, ButtonProps, Typography, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";

import ActionsTooltip from "../../ActionsTooltip";

// The real GeneralButton does NOT extend ButtonProps and has no `loading`
// prop or `children`. It renders its text via the `label` prop and exposes
// an `onAction` handler (so it can support both click and touch events).
interface GeneralButtonProps {
  onAction?: (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  ) => void;
  disabled?: boolean;
  isPrimary?: boolean; // true => primary styling, false => outlined
  fullWidth?: boolean;
  fullHeight?: boolean;
  label?: string; // button text
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  withTooltip?: boolean; // wraps the button in <ActionsTooltip>
  tooltipLabel?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  // ...plus font/spacing and other styling props
}

const GeneralButton: React.FC<GeneralButtonProps> = ({
  onAction,
  disabled = false,
  isPrimary = true,
  label = "",
  startIcon,
  endIcon,
  withTooltip = false,
  tooltipLabel,
  ...otherProps
}) => {
  // ...uses useDeviceTypeDetection() to wire up click vs. touch handlers,
  // renders {startIcon}<ButtonLabel>{label}</ButtonLabel>{endIcon}, and
  // optionally wraps the result in <ActionsTooltip>.
};

export default GeneralButton;
```

Usage:

```typescript
<GeneralButton
  label={t('general.Next')}
  isPrimary
  endIcon={<KeyboardArrowRightRoundedIcon />}
  onAction={handleNextClick}
/>
```

### Data Table Component

```typescript
// src/components/organisms/tables/DataTable/index.tsx
'use client';

import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
} from '@mui/material';

import { EnhancedTableHead } from '../EnhancedTableHead';
import { EnhancedTablePaginationRow } from '../Pagination';

interface TableHeader {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
  clickable?: boolean;
}

interface DataTableProps {
  headers: TableHeader[];
  data: Array<Record<string, unknown>>;
  setSelectedItems?: (items: (string | number)[]) => void;
  onClickRowItem?: (id: string | number) => void;
  onClickActionCell?: (id: string | number) => void;
  dataSelection?: boolean;   // show selection checkboxes (default true)
  loading?: boolean;
  notFoundTitle?: string;
  notFoundDescription?: string;
}

// Built on MUI core <Table> primitives. Composes <EnhancedTableHead> for
// the header/sorting and <EnhancedTablePaginationRow> for pagination, plus
// styled TableContainer/Table/TableRow/TableCell wrappers. Sorting state
// (order/orderBy) and selection state are managed internally.
const DataTable: React.FC<DataTableProps> = ({ headers, data, ...props }) => {
  return (
    <TableContainer>
      <Table size="small" aria-label="enhanced table">
        <EnhancedTableHead headers={headers} /* ...sort/select props */ />
        <TableBody>
          {/* rows rendered from `data`, sorted via stableSort/getComparator */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
```

---

## Additional Resources

- [Material-UI Docs](https://mui.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [React Testing Library](https://testing-library.com/react)
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
