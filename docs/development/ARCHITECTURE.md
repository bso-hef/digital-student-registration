# System Architecture

Architecture overview for Digital Student Registration.

## Overview

**Type:** Monolithic Next.js application (App Router)
**Frontend:** React 19 + Material-UI v7 + Redux
**Backend:** Next.js API Routes
**Database:** MongoDB 8.18 + Redis 7
**Testing:** Vitest (964+ tests) + Playwright (98+ E2E)

---

## Tech Stack

### Frontend

- **Next.js** 15.4.2 (App Router, SSR)
- **React** 19.1.0
- **TypeScript** 5
- **Material-UI** v7 (@emotion/styled)
- **Redux Toolkit** + Redux Persist
- **Formik + Yup** (forms/validation)
- **i18next** (English/German)
- **Sonner** (notifications)

### Backend

- **Next.js API Routes** (serverless)
- **Mongoose** 8.18.0 + mongoose-paginate-v2
- **NextAuth.js** v5 (authentication)
- **Yup** (server-side validation)

### Infrastructure

- **MongoDB** 7.0 (persistence)
- **Redis** 7 (session storage, caching)
- **Docker** (containerized deployment)

---

## Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── (home)/                  # Shared layout group
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── dashboard/       # Widgets, stats
│   │   │   ├── management/      # Classes, students
│   │   │   └── settings/        # App configuration
│   │   └── student/             # 10-step onboarding
│   │       └── [studentId]/     # Dynamic route
│   ├── (auth)/                  # Auth pages (setup, login, reset)
│   ├── api/                     # Backend API
│   │   ├── classes/             # Class CRUD
│   │   ├── students/            # Student CRUD
│   │   ├── dashboard/           # Stats & analytics
│   │   ├── auth/                # NextAuth endpoints
│   │   └── health/              # Health checks
│   ├── layout.tsx               # Root layout (server)
│   ├── ClientLayout.tsx         # Client wrapper
│   └── Providers.tsx            # Redux, Theme, i18n
│
├── components/                  # Atomic Design
│   ├── atoms/                   # Buttons, inputs, badges
│   ├── molecules/               # Headers, menus
│   └── organisms/               # Forms, tables, modals
│
├── store/                       # Redux
│   ├── actions/                 # Thunks (classActions, studentActions)
│   └── reducers/                # Slices (ui, student, class, dashboard)
│
├── models/                      # Mongoose schemas
│   ├── Class.ts
│   ├── Student.ts
│   ├── User.ts
│   ├── AuditLog.ts
│   └── AppSettings.ts
│
├── lib/
│   ├── config/                  # MongoDB, i18n, app config
│   ├── services/                # API wrappers (axios)
│   ├── validate/                # Yup schemas
│   └── auth/                    # NextAuth configuration
│
├── theme/                       # Material-UI theme
├── locales/                     # i18n (en.json, de.json)
├── constants/                   # App constants
├── types/                       # TypeScript types
└── utils/                       # Utility functions
```

---

## Data Flow

### Client → Server

```
User Action
  ↓
Component Handler
  ↓
Redux Action (thunk)
  ↓
API Service (axios)
  ↓
Next.js API Route
  ↓
Mongoose Model
  ↓
MongoDB
```

### Server → Client

```
MongoDB
  ↓
Mongoose Model
  ↓
Next.js API Route (JSON response)
  ↓
API Service
  ↓
Redux Action (dispatch SUCCESS)
  ↓
Redux Reducer (update state)
  ↓
Component Re-render
```

---

## State Management

### Redux Store Structure

```typescript
{
  ui: {
    theme: 'light' | 'dark',
    locale: 'en' | 'de',
    appTouched: boolean
  },
  student: {
    currentStep: number,           // Onboarding wizard step (1-10)
    data: StudentFormData,         // Form data across steps
    students: Student[]
  },
  class: {
    classes: Class[],
    currentClass: Class | null,
    page: number,
    limit: number,
    total: number
  },
  dashboard: {
    stats: DashboardStats | null,
    health: HealthStatus | null,
    layout: DashboardLayout        // Widget positions
  }
}
```

### Redux Patterns

**Actions:** All actions are thunks dispatching REQUEST/SUCCESS/FAILURE
**Services:** API calls abstracted in `src/lib/services/api.ts`
**Persistence:** Redux Persist stores state in localStorage

Example:

```typescript
export const getClasses = (): AppThunk => async (dispatch) => {
  dispatch({ type: GET_CLASSES_REQUEST });
  try {
    const { data } = await classService.getAll();
    dispatch({ type: GET_CLASSES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CLASSES_FAILURE, payload: toAppError(error) });
  }
};
```

---

## Database Schema

### Student Model

```typescript
{
  firstName, lastName: String,
  firstNameNorm, lastNameNorm: String,   // For collision detection
  dateOfBirth: Date,
  email: String (lowercase),
  phone: String,
  address: { street, city, state, zip, country, timezone },
  collisionGroup: String,                // Name conflict handling
  ordinal: Number,                       // Ordering students with same name
  status: "imported" | "invited" | "onboarded",
  currentClass: ObjectId,                // Reference to Class
  classHistory: [{                       // Historical assignments
    classId, schoolYear, startDate, endDate, note
  }],
  employer: {                            // For vocational students
    companyName, address, contactName, contactEmail, verified
  },
  active: Boolean,
  timestamps
}
```

**Indexes:** `firstNameNorm`, `lastNameNorm`, `currentClass`, `collisionGroup`

### Class Model

```typescript
{
  schoolYearFrom: Date,                  // e.g., 2024-08-01
  schoolYearTo: Date,                    // e.g., 2025-07-31
  name: String,                          // e.g., "10A", "BG-23"
  grade: Number,                         // 1-13, null for vocational
  isVocational: Boolean,
  requiresEmployerInfo: Boolean,
  studentCount: Number,                  // Cached count
  active: Boolean,
  timestamps
}
```

**Pre-validate hook:** Ensures `schoolYearTo > schoolYearFrom`

---

## API Architecture

### Route Pattern

All API routes in `src/app/api/` follow this pattern:

```typescript
export async function GET(req: NextRequest) {
  // 1. Database connection
  await dbConnect();

  // 2. Authentication check
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 3. Validation
  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 20;

  // 4. Database operation
  const result = await Model.paginate({}, { skip, limit });

  // 5. Response
  return NextResponse.json(result);
}
```

### Error Handling

```typescript
try {
  // operation
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: toErrorMessage(error) },
    { status: 500 }
  );
}
```

---

## Authentication

**Provider:** NextAuth.js v5
**Strategy:** Credentials (email + password)
**Session:** JWT stored in HTTP-only cookies (24h)
**Protection:** Middleware protects `/admin/*` routes

### Auth Flow

1. **Setup** (`/setup`): Create admin account + recovery code
2. **Login** (`/login`): Authenticate with email/password
3. **Password Reset** (`/reset-password`): Email + recovery code + new password

---

## Student Onboarding Flow

10-step wizard at `/student/[studentId]`:

1. **Welcome** - Class selection
2. **General** - Name, gender, DOB, religion
3. **Origin** - Birthplace, nationality, language
4. **Address** - Student address and contact
5. **Parents/Guardians** - Contact persons
6. **Pre-Education** - Previous school, qualifications
7. **Training** - Vocational training (if applicable)
8. **Company** - Employer info (if vocational)
9. **Summary** - Review all data
10. **Completion** - Success message

**State:** Persisted in Redux (`student.data`, `student.currentStep`)
**Validation:** Formik + Yup schemas
**Submission:** Only on final step (step 10)

---

## Component Architecture

**Pattern:** Atomic Design

- **Atoms** (basic): GeneralButton, GeneralInput, ClassStatus
- **Molecules** (composed): AdminSettingsHeader, StatCard
- **Organisms** (complex): Forms, DataTable, Modals, Navigation

**Styling:** Material-UI `styled()` API with Emotion
**Theme:** Light/Dark mode via Redux state
**Responsive:** `theme.breakpoints` for mobile/tablet/desktop

---

## Internationalization

- **Library:** i18next
- **Languages:** English (en), German (de)
- **Files:** `src/locales/en.json`, `src/locales/de.json`
- **Detection:** Automatic from browser, persisted in Redux
- **Usage:** `useTranslation()` hook or `t()` function

---

## Performance Considerations

- **MongoDB:** Connection pooling via cached `dbConnect()`
- **Pagination:** Always paginate (mongoose-paginate-v2)
- **Indexes:** On frequently queried fields
- **Code Splitting:** Automatic with Next.js
- **SSR:** Server-side rendering for initial load
- **Caching:** Redis for session storage

---

## Security

- **Authentication:** NextAuth.js with bcrypt hashing (12 rounds)
- **Authorization:** Middleware protects admin routes
- **Validation:** Yup schemas (client + server)
- **SQL Injection:** Protected by Mongoose
- **XSS:** React auto-escapes
- **CSRF:** SameSite cookies
- **Secrets:** Environment variables (never committed)

---

## Deployment

**Docker Compose** with profiles:

- `app-linux` / `app-windows`: Next.js application
- `mongo`: MongoDB 7.0
- `redis`: Redis 7

**Critical:** Set `NEXT_PUBLIC_APP_URL` to production domain before building (QR codes embed this URL).

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

---

## Additional Resources

- [COMPONENTS.md](COMPONENTS.md) - Component development
- [API.md](API.md) - API endpoints documentation
- [DATABASE.md](DATABASE.md) - Database schema details
- [TESTING.md](TESTING.md) - Testing guide
