# Component Development Guide

Complete guide for developing components using Atomic Design pattern.

## Table of Contents

- [Overview](#overview)
- [Atomic Design Pattern](#atomic-design-pattern)
- [Component Structure](#component-structure)
- [Atoms](#atoms)
- [Molecules](#molecules)
- [Organisms](#organisms)
- [Creating New Components](#creating-new-components)
- [Component Best Practices](#component-best-practices)
- [Testing Components](#testing-components)

---

## Overview

The application uses **Atomic Design** methodology to organize components into a hierarchy:

```text
Atoms → Molecules → Organisms → Templates → Pages
```

### Component Location

```text
src/components/
├── atoms/          # Basic UI elements
├── molecules/      # Composed components
└── organisms/      # Complex features
```

### Naming Conventions

- **PascalCase** for component names: `GeneralButton`
- **Index file** for exports: `index.tsx`
- **Test file** alongside component: `ComponentName.test.tsx`

---

## Atomic Design Pattern

### Atoms

**Definition:** Basic building blocks that can't be broken down further.

**Examples:**

- Buttons
- Inputs
- Labels
- Icons
- Avatars

**Location:** `src/components/atoms/`

### Molecules

**Definition:** Groups of atoms functioning together as a unit.

**Examples:**

- Form fields with labels
- Search bars
- Header with logo and navigation
- Card with title and content

**Location:** `src/components/molecules/`

### Organisms

**Definition:** Complex components composed of atoms and molecules.

**Examples:**

- Navigation bars
- Data tables
- Forms
- Modals
- Charts

**Location:** `src/components/organisms/`

---

## Component Structure

### Standard Component Structure

```text
ComponentName/
├── index.tsx               # Component implementation
└── ComponentName.test.tsx  # Unit tests
```

### Example Component

```typescript
// src/components/atoms/buttons/GeneralButton/index.tsx
import { Button, ButtonProps, styled } from "@mui/material";
import { FC } from "react";

interface GeneralButtonProps {
  label: string;
  onAction: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const GeneralButton: FC<GeneralButtonProps> = ({
  label,
  onAction,
  variant = "contained",
  color = "primary",
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      onClick={onAction}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={icon}
    >
      {label}
    </StyledButton>
  );
};

export default GeneralButton;
```

---

## Atom

### Button Components

**Location:** `src/components/atoms/buttons/`

#### GeneralButton

General-purpose button with variants.

```typescript
import GeneralButton from "@/components/atoms/buttons/GeneralButton";

<GeneralButton
  label="Save"
  onAction={handleSave}
  variant="contained"
  color="primary"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Button text |
| `onAction` | `() => void` | Required | Click handler |
| `variant` | `string` | `"contained"` | Button style |
| `color` | `string` | `"primary"` | Button color |
| `disabled` | `boolean` | `false` | Disabled state |
| `fullWidth` | `boolean` | `false` | Full width |
| `icon` | `ReactNode` | `undefined` | Icon element |

#### SmallIconButton

Icon-only button with tooltip.

```typescript
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import DeleteIcon from "@mui/icons-material/Delete";

<SmallIconButton
  icon={<DeleteIcon />}
  onAction={handleDelete}
  title="Delete item"
  placement="top"
/>
```

### Input Components

**Location:** `src/components/atoms/`

#### GeneralInput

Styled text input with label.

```typescript
import GeneralInput from "@/components/atoms/GeneralInput";

<GeneralInput
  label="Email"
  value={email}
  onChange={setEmail}
  type="email"
  placeholder="Enter your email"
  required
/>
```

### Dropdown Components

**Location:** `src/components/atoms/dropdowns/`

#### ThemeDropdown

Theme switcher (light/dark/system).

```typescript
import ThemeDropdown from "@/components/atoms/dropdowns/ThemeDropdown";

<ThemeDropdown />
```

#### LanguageDropdown

Language selector (EN/DE).

```typescript
import LanguageDropdown from "@/components/atoms/dropdowns/LanguageDropdown";

<LanguageDropdown />
```

### Status Components

**Location:** `src/components/atoms/status/`

#### ClassStatus

Displays class status with colored chip.

```typescript
import ClassStatus from "@/components/atoms/status/ClassStatus";

<ClassStatus active={true} />
```

#### StudentStatus

Displays student status (imported/invited/onboarded).

```typescript
import StudentStatus from "@/components/atoms/status/StudentStatus";

<StudentStatus status="onboarded" />
```

### Display Components

#### Logo

Application logo component.

```typescript
import Logo from "@/components/atoms/Logo";

<Logo width={150} height={50} />
```

#### ProfileAvatar

User avatar with initials fallback.

```typescript
import ProfileAvatar from "@/components/atoms/ProfileAvatar";

<ProfileAvatar
  name="John Doe"
  src="/avatar.jpg"
  size="medium"
/>
```

---

## Molecule

### Header Components

**Location:** `src/components/molecules/`

#### AdminSettingsHeader

Page header for admin section with title and actions.

```typescript
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";

<AdminSettingsHeader title="Dashboard" onLoad={loading}>
  <SmallIconButton
    icon={<AddIcon />}
    onAction={handleAdd}
    title="Add new"
  />
</AdminSettingsHeader>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title |
| `onLoad` | `boolean` | Loading state |
| `children` | `ReactNode` | Action buttons |

### Dashboard Components

**Location:** `src/components/molecules/dashboard/`

#### StatCard

Displays a statistic with icon and label.

```typescript
import StatCard from "@/components/atoms/dashboard/StatCard";

<StatCard
  title="Total Students"
  value={150}
  icon={<PeopleIcon />}
  color="primary"
  trend={+12}
/>
```

#### SystemHealthWidget

Displays system health indicators.

```typescript
import SystemHealthWidget from "@/components/molecules/dashboard/SystemHealthWidget";

<SystemHealthWidget health={healthData} />
```

---

## Organism

### Table Components

**Location:** `src/components/organisms/tables/`

#### DataTable

Comprehensive data table with sorting, filtering, pagination.

```typescript
import DataTable from "@/components/organisms/tables/DataTable";

<DataTable
  columns={columns}
  rows={rows}
  onSort={handleSort}
  onFilter={handleFilter}
  onPageChange={handlePageChange}
  selectable
  onRowSelect={handleRowSelect}
/>
```

**Features:**

- Sorting by column
- Multi-column filtering
- Row selection (single/multiple)
- Pagination
- Custom cell renderers
- Responsive design

### Form Components

**Location:** `src/components/organisms/forms/`

#### Onboarding Forms

Ten specialized form components for student onboarding:

1. **WelcomeForm** - Introduction
2. **GeneralForm** - Basic info
3. **OriginForm** - Nationality
4. **AddressForm** - Residence
5. **ParentsForm** - Guardians
6. **PreEducationForm** - Previous school
7. **TrainingForm** - Program selection
8. **CompanyContactForm** - Employer (conditional)
9. **SummaryForm** - Review
10. **FormCompletion** - Confirmation

**Example Usage:**

```typescript
import GeneralForm from "@/components/organisms/forms/GeneralForm";

<GeneralForm
  initialValues={studentData}
  onSubmit={handleSubmit}
  onBack={handleBack}
/>
```

### Modal Components

**Location:** `src/components/organisms/modals/`

#### GeneralModal

Base modal component.

```typescript
import GeneralModal from "@/components/organisms/modals/GeneralModal";

<GeneralModal
  open={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  maxWidth="sm"
>
  <Box p={2}>
    Modal content here
  </Box>
</GeneralModal>
```

#### AddClassModal

Modal for adding new classes.

```typescript
import AddClassModal from "@/components/organisms/modals/AddClassModal";

<AddClassModal
  open={isOpen}
  onClose={handleClose}
  onSubmit={handleAddClass}
/>
```

### Navigation Components

**Location:** `src/components/organisms/`

#### LeftNavigation

Collapsible sidebar navigation for admin section.

```typescript
import LeftNavigation from "@/components/organisms/LeftNavigation";

<LeftNavigation
  routes={routesConfig}
  currentPath={pathname}
/>
```

**Features:**

- Collapsible menu
- Nested routes
- Active state highlighting
- Search functionality
- Responsive (drawer on mobile)

---

## Creating New Components

### Step-by-Step Guide

#### 1. Determine Component Type

Ask yourself:

- Can it be broken down? → Molecule or Organism
- Is it a single element? → Atom
- Does it combine multiple atoms? → Molecule
- Is it a complete feature? → Organism

#### 2. Create Component Directory

```bash
# For atom
mkdir -p src/components/atoms/MyAtom

# For molecule
mkdir -p src/components/molecules/MyMolecule

# For organism
mkdir -p src/components/organisms/MyOrganism
```

#### 3. Create Component File

```typescript
// src/components/atoms/MyAtom/index.tsx
import { FC } from "react";
import { styled, Box } from "@mui/material";

interface MyAtomProps {
  // Define props
}

const StyledContainer = styled(Box)(({ theme }) => ({
  // Styles
}));

const MyAtom: FC<MyAtomProps> = (props) => {
  return (
    <StyledContainer>
      {/* Component JSX */}
    </StyledContainer>
  );
};

export default MyAtom;
```

#### 4. Create Test File

```typescript
// src/components/atoms/MyAtom/MyAtom.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/utils/test-utils";
import MyAtom from "./index";

describe("MyAtom", () => {
  it("should render correctly", () => {
    renderWithProviders(<MyAtom />);
    expect(screen.getByTestId("my-atom")).toBeInTheDocument();
  });
});
```

#### 5. Use Component

```typescript
import MyAtom from "@/components/atoms/MyAtom";

function ParentComponent() {
  return <MyAtom />;
}
```

---

## Component Best Practices

### 1. Use TypeScript

Define explicit props interfaces:

```typescript
interface ComponentProps {
  title: string;
  count: number;
  onAction: (id: string) => void;
  optional?: boolean;
}
```

### 2. Use Functional Components

Always use functional components with hooks:

```typescript
const Component: FC<ComponentProps> = ({ title }) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    // Effects
  }, []);

  return <div>{title}</div>;
};
```

### 3. Use Styled Components

Use MUI's `styled()` API:

```typescript
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1),
  },
}));
```

### 4. Prevent Prop Forwarding

Prevent invalid DOM props:

```typescript
const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.main : "inherit",
}));
```

### 5. Use Memoization

Optimize performance with `memo`, `useMemo`, `useCallback`:

```typescript
import { memo, useMemo, useCallback } from "react";

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(/* expensive operation */);
  }, [data]);

  const handleClick = useCallback(() => {
    // Handler
  }, []);

  return <div>{processedData}</div>;
});
```

### 6. Accessibility

Always include ARIA attributes:

```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isActive}
  tabIndex={0}
  role="button"
>
  Close
</button>
```

### 7. Loading States

Handle loading gracefully:

```typescript
if (loading) {
  return <CircularProgress />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <Content data={data} />;
```

### 8. Error Boundaries

Wrap components in error boundaries for production:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

---

## Testing Components

### Unit Test Pattern

```typescript
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../tests/utils/test-utils";
import MyComponent from "./index";

describe("MyComponent", () => {
  it("should render with props", () => {
    renderWithProviders(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithProviders(<MyComponent onClick={handleClick} />);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage Goals

| Component Type | Target Coverage |
| -------------- | --------------- |
| Atoms          | 75%+            |
| Molecules      | 70%+            |
| Organisms      | 65%+            |

---

## Component Checklist

Before marking a component complete:

- [ ] TypeScript props interface defined
- [ ] Component renders correctly
- [ ] Responsive design implemented
- [ ] Accessibility attributes added
- [ ] Loading/error states handled
- [ ] Unit tests written (>70% coverage)
- [ ] Documented in this guide
- [ ] Exported from index file
- [ ] Used in at least one place

---

## Next Steps

- Read [FORMS.md](./FORMS.md) for form component patterns
- Read [STYLING.md](./STYLING.md) for theming details
- Read [STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md) for Redux integration
