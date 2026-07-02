# System Architecture

Architecture overview for Digital Student Registration.

## Overview

**Type:** Monolithic Next.js application (App Router)
**Frontend:** React 19 + Material-UI v7 + Redux
**Backend:** Next.js API Routes
**Database:** MongoDB 7.0 + Redis 7
**Testing:** Vitest only (~2070 unit tests across 76 test files; 2 further integration files exist but are excluded from the run)

---

## Tech Stack

### Frontend

- **Next.js** 15.4.10 (App Router, SSR)
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
│   │   └── student/             # 11-step onboarding (ids 0–10)
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
│   └── reducers/                # Slices (appSettings, auditLog, auth, class, dashboard, student, ui)
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

The root reducer (`src/store/reducers/index.ts`) combines **seven** slices:

```typescript
{
  appSettings: { /* ... */ },      // Application settings
  auditLog: { /* ... */ },         // Audit log entries
  auth: { /* ... */ },             // Auth/session state
  ui: {
    documnetDraggedOver: boolean,
    appTouched: boolean,
    theme: 'light' | 'dark',
    locale: string,                // defaults to German
    loading: boolean,
    error: Error | null,
    highContrast: boolean,
    dyslexiaFont: boolean
  },
  student: {
    currentStep: number,           // Onboarding wizard step, starts at 0 (steps 0–10)
    previousStep: number | null,
    editingFromSummary: boolean,
    data: StudentData,             // Form data across steps
    students: Student[],
    currentClass: ClassInterface | null,
    studentStatus: string | null,
    currentStudentId: string | null,
    currentStudent: Student | null,
    loading: boolean,
    error: Error | null,
    currentStudentLoading: boolean
  },
  class: {
    classes: ClassInterface[],
    currentClass: {                // Object, not Class | null
      data: ClassInterface | null,
      loading: boolean,
      error: string | null,
      success: boolean
    },
    currentClassStudents: { students: Student[], loading: boolean, error: string | null },
    byId: Record<string, ClassInterface>,
    loading: boolean,
    error: string | null,
    page: number,
    limit: number,
    total: number,
    pages: number
  },
  dashboard: {
    stats: DashboardStats | null,
    health: HealthReport | null,
    recentActivity: RecentActivityItem[],
    activityLoading: boolean,
    loading: boolean,
    error: string | null,
    lastUpdated: string | null,
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
  // Identity
  firstName, lastName: String (required, trimmed),
  birthName: String,
  dateOfBirth: Date (required),
  gender: "male" | "female" | "diverse",
  birthplace: String,
  birthCountry: String,
  religion: String,

  // Nationality & language
  nationality: String,
  secondNationality: String,
  familyLanguage: String,
  immigrationYear: Number,

  // Contact
  email: String (lowercase, trimmed),
  phone: String,
  address: { street, city, state, zip, country, timezone },

  // Class assignment
  currentClass: ObjectId,                // Reference to Class (default null)
  currentClassName: String,
  schoolEntryDate: Date,
  classHistory: [{                       // Historical assignments
    classId, schoolYear, startDate, endDate, note
  }],

  // Prior education
  previousSchool: String,
  previousSchoolType: String,
  previousSchoolLevel: String,
  degrees: String,

  // Vocational
  profession: String,
  trainingStartDate: Date,
  employer: {                            // For vocational students
    companyName, address, contactName, contactEmail, contactPhone, contactSalutation,
    contact2Name, contact2Email, contact2Phone, contact2Salutation, verified
  },

  // Guardians / contacts
  contactPersons: [{ type, firstName, lastName, phone, mobile, address }],

  // Agreements (consent)
  agreements: { dataProtection, classParticipation, schoolRules, imageRights, teamsUsage },

  // Onboarding & collision handling
  onboardingStep: Number,                // default 0
  previousStep: Number | null,
  firstNameNorm, lastNameNorm: String (required, indexed),  // For collision detection
  collisionGroup: String,                // Name conflict handling
  ordinal: Number,                       // Ordering students with same name (default 1)
  status: "imported" | "invited" | "onboarded",   // default "imported"
  verificationCode: String,              // Unique, sparse, 6-char [0-9A-Z], uppercased

  active: Boolean,                       // default true
  timestamps
}
```

**Indexes:** `firstNameNorm`, `lastNameNorm`, `collisionGroup`, `ordinal`; `verificationCode` (unique + sparse); compound `{ firstNameNorm, lastNameNorm, dateOfBirth }`; partial `{ currentClass }` (only where `active: true`)

**Pre-save hooks:** A unique `verificationCode` is generated for new documents; employer info is validated when a student's status changes to `onboarded` and the assigned class requires employer info.

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
  incomplete: Boolean,                   // Indexed; true when grade is null/undefined
  timestamps
}
```

**Pre-save hook:** Derives `incomplete` from `grade` (`true` when `grade` is `null`/`undefined`, otherwise `false`).
**Pre-validate hook:** Ensures `schoolYearFrom`/`schoolYearTo` are present and `schoolYearTo > schoolYearFrom` (error messages are in German).
**Indexes:** Unique compound `{ schoolYearFrom, schoolYearTo, name }`; `incomplete`.

---

## API Architecture

### Route Pattern

All API routes in `src/app/api/` follow this pattern:

```typescript
export async function GET(req: NextRequest) {
  try {
    // 1. Authentication check FIRST
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 2. Database connection
    await dbConnect();

    // 3. Parse params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") || 25)),
    );
    const skip = (page - 1) * limit;

    // 4. Manual pagination via .find().skip().limit() + countDocuments()
    const [items, total] = await Promise.all([
      Model.find({})
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Model.countDocuments({}),
    ]);

    // 5. Response
    return NextResponse.json(
      { items, page, limit, total, pages: Math.ceil(total / limit) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
```

Notes:

- Routes call `auth()` **before** `dbConnect()`.
- Pagination is done manually with `.find().skip().limit()` plus `countDocuments()` — routes do **not** use `Model.paginate`.
- Mutating routes (POST/DELETE/etc.) record an audit entry via `createAuditLog()` from `@/server/middleware/audit.middleware`. Shared server-side helpers live under `src/server/`.

### Error Handling

```typescript
try {
  // operation
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
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

11-step wizard (ids 0–10) at `/student/[studentId]`, defined in `src/constants/studentSteps.constants.tsx` and rendered by `src/components/organisms/StepForm/index.tsx`:

0. **Welcome** - Class selection
1. **General** - Name, gender, DOB, religion
2. **Origin** - Birthplace, nationality, language _(conditional: only for non-German origin)_
3. **Address** - Student address and contact
4. **Legal Guardian** - Contact persons
5. **Pre-Education** - Previous school, qualifications
6. **Training** - Vocational training _(conditional: vocational classes only)_
7. **Company Contact** - Employer info _(conditional: vocational classes only)_
8. **Agreements** - Consent (data protection, class participation, school rules, image rights, Teams usage)
9. **Summary** - Review all data
10. **Completion** - Success screen

Conditional steps are filtered out by `getActiveSteps()` when not applicable, so a given student sees fewer than 11 steps.

**State:** Persisted in Redux (`student.data`, `student.currentStep`; starts at step 0)
**Validation:** Formik + Yup schemas
**Submission:** Triggered from the **Summary** step (step 9). Step 10 (Completion) is only a success screen, not a submission step.

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
- **Pagination:** List endpoints page results via manual `.skip()`/`.limit()` + `countDocuments()` (the `mongoose-paginate-v2` plugin is also registered on the models)
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
