# System Architecture

Complete system architecture documentation for the Digital Student Registration application.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Component Hierarchy](#component-hierarchy)
- [Routing Structure](#routing-structure)
- [Security Considerations](#security-considerations)

---

## Overview

Digital Student Registration is a **monolithic Next.js application** using the App Router pattern. It combines frontend and backend in a single codebase, with MongoDB for data persistence.

### Architecture Type

- **Monolithic** - Single deployable unit
- **Full-Stack** - Next.js API Routes + React frontend
- **Server-Side Rendered** - SSR with React Server Components
- **Client-Side State** - Redux for client state management

---

## Tech Stack

### Frontend

```
React 19.1.0
├── Next.js 15.4.2 (App Router)
├── TypeScript 5
├── Material-UI v7
│   ├── @emotion/react
│   └── @emotion/styled
├── Redux Toolkit
│   └── Redux Persist
├── Formik + Yup
├── i18next
└── Sonner (toasts)
```

### Backend

```
Next.js API Routes
├── MongoDB
│   └── Mongoose 8.18.0
│       └── mongoose-paginate-v2
├── Winston (logging)
└── Socket.IO Client (ready for integration)
```

### Development & Testing

```
Development
├── TypeScript 5
├── ESLint
├── Prettier
└── Turbopack (dev server)

Testing
├── Vitest (unit/integration)
├── Playwright (E2E)
├── React Testing Library
└── MSW (API mocking)
```

---

## Application Structure

### Directory Layout

```
digital-student-registration/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (home)/             # Route group (admin + student)
│   │   │   ├── admin/          # Admin section
│   │   │   │   ├── dashboard/
│   │   │   │   ├── management/
│   │   │   │   │   ├── classes/
│   │   │   │   │   └── students/
│   │   │   │   └── settings/
│   │   │   └── student/        # Student onboarding
│   │   │       └── [studentId]/
│   │   ├── api/                # Backend API routes
│   │   │   ├── classes/
│   │   │   ├── students/
│   │   │   ├── dashboard/
│   │   │   └── health/
│   │   ├── layout.tsx          # Root layout (server)
│   │   ├── ClientLayout.tsx    # Client wrapper
│   │   └── Providers.tsx       # Context providers
│   ├── components/
│   │   ├── atoms/              # Basic UI elements
│   │   ├── molecules/          # Composed components
│   │   └── organisms/          # Complex features
│   ├── store/                  # Redux
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store.ts
│   ├── models/                 # Mongoose schemas
│   ├── lib/
│   │   ├── config/             # Configuration
│   │   ├── services/           # API wrappers
│   │   └── validate/           # Validation
│   ├── theme/                  # MUI theme
│   ├── locales/                # i18n translations
│   ├── constants/              # App constants
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── tests/                      # Test suites
│   ├── e2e/
│   ├── unit/
│   ├── integration/
│   └── utils/
├── docs/                       # Documentation
└── public/                     # Static assets
```

### Key Directories

| Directory         | Purpose                           |
| ----------------- | --------------------------------- |
| `src/app/(home)/` | Main application routes (grouped) |
| `src/app/api/`    | Backend API endpoints             |
| `src/components/` | React components (atomic design)  |
| `src/store/`      | Redux state management            |
| `src/models/`     | MongoDB schemas                   |
| `src/lib/`        | Shared libraries and utilities    |
| `src/theme/`      | Material-UI theme configuration   |

---

## Frontend Architecture

### Next.js App Router

The application uses Next.js 15's App Router with **React Server Components** (RSC).

#### Layout Hierarchy

```
app/layout.tsx (Root Layout - Server Component)
└── ClientLayout.tsx (Client Boundary)
    └── Providers.tsx (Redux, Theme, i18n, MUI)
        └── (home)/layout.tsx (Route Group Layout)
            ├── admin/layout.tsx (Admin Layout)
            │   ├── LeftNavigation
            │   └── dashboard/page.tsx
            │       management/page.tsx
            │       settings/page.tsx
            └── student/layout.tsx (Student Layout)
                └── [studentId]/page.tsx
```

#### Server vs Client Components

**Server Components:**

- `app/layout.tsx` - Root layout
- `app/(home)/layout.tsx` - Route group layout
- Metadata and SEO configuration

**Client Components:**

- All interactive components (`"use client"`)
- Redux-connected components
- MUI components
- Form components

### Component Architecture

Uses **Atomic Design Pattern**:

```
Atoms (Basic UI)
├── Buttons (GeneralButton, SmallIconButton)
├── Inputs (GeneralInput, HeaderSearchInput)
├── Dropdowns (ThemeDropdown, LanguageDropdown)
├── Status (ClassStatus, StudentStatus)
└── Display (Logo, ProfileAvatar, CustomTitle)

Molecules (Composed)
├── Headers (AdminSettingsHeader, AdminSubPageHeader)
├── Menus (AccessibilityMenu)
└── Dashboard (StatCard, ChartContainer, HealthIndicator)

Organisms (Complex Features)
├── Navigation (LeftNavigation)
├── Tables (DataTable, EnhancedTableHead, Pagination)
├── Forms (10 onboarding forms)
├── Modals (AddClassModal, AddStudentModal, GeneralModal)
└── Charts (RegistrationTrendChart, ClassDistributionChart)
```

### Styling Approach

**Material-UI v7** with **Emotion** styled components:

```typescript
import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));
```

---

## Backend Architecture

### Next.js API Routes

Backend implemented as API Routes in `src/app/api/`.

#### API Structure

```
api/
├── classes/
│   ├── route.ts                 # GET, POST, DELETE (list)
│   └── [classId]/
│       ├── route.ts             # GET, PATCH, DELETE (single)
│       └── students/
│           └── route.ts         # GET (class students)
├── students/
│   └── route.ts                 # GET, POST, DELETE
├── dashboard/
│   └── stats/
│       └── route.ts             # GET (dashboard stats)
└── health/
    ├── live/
    │   └── route.ts             # GET (liveness)
    └── full/
        └── route.ts             # GET (full health)
```

#### Route Handler Pattern

```typescript
// src/app/api/classes/route.ts
import { dbConnect } from "@/lib/config/mongo";
import Class from "@/models/Class";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 20;

  const result = await Class.paginate({}, { skip, limit });

  return NextResponse.json(result);
}
```

### Database Layer

**MongoDB** with **Mongoose ODM**:

- **Connection Pooling** - Global caching for serverless
- **Schema Validation** - Mongoose schemas with TypeScript
- **Hooks** - Pre-save, pre-validate for business logic
- **Pagination** - mongoose-paginate-v2 plugin

#### Database Connection

```typescript
// src/lib/config/mongo.ts
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## State Management

### Redux Architecture

**Redux Toolkit** with **Redux Persist** for client state.

#### Store Structure

```typescript
{
  ui: {                          // UI preferences
    theme: 'light' | 'dark',
    locale: 'en' | 'de',
    appTouched: boolean,
    loading: boolean,
    error: Error | null
  },
  student: {                     // Student onboarding
    currentStep: number,
    data: StudentFormData,
    students: Student[],
    loading: boolean,
    error: Error | null
  },
  class: {                       // Class management
    classes: Class[],
    currentClass: {
      data: Class | null,
      loading: boolean,
      error: Error | null,
      success: boolean
    },
    byId: { [id: string]: Class },
    loading: boolean,
    error: string | null,
    page: number,
    limit: number,
    total: number,
    pages: number
  },
  dashboard: {                   // Dashboard data
    stats: DashboardStats | null,
    health: HealthStatus | null,
    loading: boolean,
    error: Error | null,
    layout: DashboardLayout
  },
  appSettings: {                 // App settings
    // Placeholder for future features
  }
}
```

#### Persistence

Redux Persist saves state to `localStorage`:

```typescript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "student", "class"], // Only persist these
};
```

#### Thunk Actions

Async actions use Redux Thunk:

```typescript
export const getClasses = (): AppThunk => async (dispatch) => {
  dispatch({ type: GET_CLASSES_REQUEST });

  try {
    const { data } = await classService.getAll();
    dispatch({ type: GET_CLASSES_SUCCESS, payload: data });
  } catch (error) {
    errorNotification(i18n.t("actions.classFetchFailed"));
    dispatch({ type: GET_CLASSES_FAILURE, payload: toAppError(error) });
  }
};
```

---

## Data Flow

### Request Flow

```
User Action
  ↓
UI Component
  ↓
Redux Action (Thunk)
  ↓
API Service (axios)
  ↓
Next.js API Route
  ↓
Mongoose Model
  ↓
MongoDB
  ↓
Response → Reducer → Component → UI Update
```

### Example: Create Class Flow

```
1. User clicks "Add Class" button
   → AddClassModal opens

2. User fills form and submits
   → Formik validates with Yup schema

3. onSubmit calls Redux action
   → dispatch(createClass(classData))

4. createClass thunk executes
   → classService.create(classData)

5. API call to POST /api/classes
   → Next.js route handler

6. Mongoose validates and saves
   → Class.create(classData)

7. Success response returns
   → Dispatch success action

8. Reducer updates state
   → class.classes array updated

9. Component re-renders
   → DataTable shows new class

10. Success notification
    → Sonner toast displayed
```

---

## Component Hierarchy

### Admin Section

```
AdminLayout
├── LeftNavigation (sidebar)
│   ├── Logo
│   ├── NavigationItems (collapsible)
│   └── HeaderSearchInput
└── Main Content
    ├── DashboardPage
    │   ├── AdminSettingsHeader
    │   ├── DraggableStatsGrid
    │   │   └── StatCard (x4)
    │   └── DraggableChartGrid
    │       ├── RegistrationTrendChart
    │       ├── ClassDistributionChart
    │       ├── StudentStatusChart
    │       └── SystemHealthWidget
    ├── ClassesManagementPage
    │   ├── AdminSettingsHeader
    │   │   ├── SmallIconButton (Add)
    │   │   ├── SmallIconButton (Delete)
    │   │   └── SmallIconButton (Export)
    │   └── DataTable
    │       ├── EnhancedTableHead
    │       ├── TableBody (rows)
    │       └── Pagination
    └── StudentsManagementPage
        └── (similar to classes)
```

### Student Onboarding Section

```
StudentLayout
└── [studentId]
    ├── BackgroundStudyPattern (decorative)
    ├── DynamicPageStepper
    │   └── Stepper (10 steps)
    └── StepForm
        ├── WelcomeForm
        ├── GeneralForm
        ├── OriginForm
        ├── AddressForm
        ├── ParentsForm
        ├── PreEducationForm
        ├── TrainingForm
        ├── CompanyContactForm
        ├── SummaryForm
        └── FormCompletion
```

---

## Routing Structure

### Route Groups

Next.js route groups `()` organize routes without affecting URL:

```
app/
├── (home)/                    # Route group (not in URL)
│   ├── layout.tsx            # Shared layout for admin & student
│   ├── admin/                # URL: /admin
│   │   ├── dashboard/        # URL: /admin/dashboard
│   │   ├── management/
│   │   │   ├── classes/      # URL: /admin/management/classes
│   │   │   └── students/     # URL: /admin/management/students
│   │   └── settings/         # URL: /admin/settings
│   └── student/              # URL: /student
│       └── [studentId]/      # URL: /student/abc123
└── api/                       # URL: /api/*
```

### Dynamic Routes

```typescript
// src/app/(home)/student/[studentId]/page.tsx
export default function StudentOnboardingPage({
  params,
}: {
  params: { studentId: string };
}) {
  const { studentId } = params;
  // ...
}
```

### Middleware

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // Currently a placeholder for authentication
  // Future: JWT verification, role-based access control
}
```

---

## Security Considerations

### Current Implementation

1. **Input Validation**
   - Yup schemas for forms
   - Mongoose validation for database
   - API route validation functions

2. **Data Sanitization**
   - String trimming
   - Email lowercasing
   - Name normalization

3. **Error Handling**
   - Generic error messages to clients
   - Detailed logging server-side

### Future Enhancements

1. **Authentication**
   - JWT-based auth
   - Secure cookie storage
   - Refresh token rotation

2. **Authorization**
   - Role-based access control (RBAC)
   - Admin vs Student permissions
   - API endpoint protection

3. **Rate Limiting**
   - API request throttling
   - DDoS protection

4. **HTTPS**
   - SSL/TLS in production
   - Secure cookie flags
   - HSTS headers

---

## Performance Optimizations

### Frontend

1. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports for large components

2. **Image Optimization**
   - Next.js Image component
   - Lazy loading

3. **Client-Side Caching**
   - Redux Persist for state
   - Browser localStorage

### Backend

1. **Database**
   - Indexes on frequently queried fields
   - Lean queries (plain objects)
   - Pagination for large datasets

2. **Connection Pooling**
   - MongoDB connection caching
   - Reuse connections in serverless

3. **API Response Caching**
   - (Future) Redis cache layer
   - (Future) CDN for static assets

---

## Deployment Architecture

### Development

```
Developer → yarn dev → Next.js Dev Server (Turbopack)
                     → MongoDB (localhost:27017)
                     → HTTPS (localhost:3000)
```

### Production

```
Build Process:
  yarn build → Next.js Static Generation
            → Optimized bundles

Deployment:
  Server → Next.js Production Server
        → MongoDB (Production URI)
        → Reverse Proxy (Nginx)
        → SSL/TLS Certificate
```

### Environment Variables

```env
# Development
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding
NEXT_PUBLIC_API_URL=https://localhost:3000

# Production
NODE_ENV=production
MONGODB_URI=mongodb://prod-server:27017/prod-db
NEXT_PUBLIC_API_URL=https://app.example.com
```

---

## Technology Choices

### Why Next.js?

- **Integrated Backend** - API routes eliminate need for separate Express server
- **SSR + CSR** - Flexible rendering strategies
- **TypeScript Support** - First-class TypeScript integration
- **Production Ready** - Built-in optimizations

### Why Redux?

- **Complex State** - Multi-step forms, dashboard data, UI preferences
- **Persistence** - Redux Persist for offline support
- **DevTools** - Excellent debugging tools
- **Established** - Mature ecosystem

### Why Material-UI?

- **Comprehensive** - Complete component library
- **Themeable** - Dark mode, accessibility features
- **Responsive** - Mobile-first design
- **TypeScript** - Full type definitions

### Why MongoDB?

- **Flexible Schema** - Easy to evolve data models
- **JSON-native** - Natural fit for JavaScript
- **Scalable** - Horizontal scaling support
- **Mongoose** - Excellent ODM with TypeScript

---

## Scalability Considerations

### Current Limits

- **Monolithic** - Single deployment unit
- **Vertical Scaling** - Scale up server resources
- **Single Database** - MongoDB instance

### Future Scaling Options

1. **Horizontal Scaling**
   - Multiple Next.js instances behind load balancer
   - MongoDB replica set for read scaling

2. **Microservices**
   - Separate auth service
   - Separate notification service
   - Message queue (RabbitMQ, Kafka)

3. **Caching Layer**
   - Redis for session storage
   - CDN for static assets

4. **Database Optimization**
   - Read replicas
   - Sharding for large datasets
   - Archive old data

---

## Monitoring & Logging

### Current Implementation

**Winston Logger:**

```typescript
// src/lib/server-logger.ts
const logger = new Logger("API");
logger.info("Request received");
logger.error("Database connection failed");
```

### Future Monitoring

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)

2. **Infrastructure Monitoring**
   - Server metrics (CPU, memory, disk)
   - Database metrics (connections, queries)

3. **Log Aggregation**
   - Centralized logging (ELK Stack)
   - Log analysis and alerts

---

## Summary

The Digital Student Registration application is a **modern full-stack monolithic application** built with:

- **Next.js 15** for unified frontend and backend
- **React 19** with TypeScript for type safety
- **Redux** for complex client state management
- **MongoDB + Mongoose** for flexible data persistence
- **Material-UI v7** for comprehensive UI components

The architecture prioritizes **developer experience**, **type safety**, and **maintainability** while remaining scalable for future growth.
