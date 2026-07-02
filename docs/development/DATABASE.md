# Database Documentation

MongoDB database schema and model documentation.

## Overview

**Database:** MongoDB with Mongoose 8.18.0
**Location:** `src/models/`
**Connection:** `src/lib/config/mongo.ts`

**URI:** `mongodb://localhost:27017/digital-student-onboarding`

---

## Connection Management

### Location

`src/lib/config/mongo.ts`

### Features

- Connection pooling with global caching (`connectOnce()` caches the connection/promise on `global.__mongoCache`)
- Retry logic with exponential backoff — only in `initializeMongo()` (used at startup, default 5 attempts with `2^retry * 1000ms` delays). The per-request `dbConnect()` simply calls `connectOnce()` once with no retry loop.
- Event listeners for state tracking (bound once inside `initializeMongo()`)

### Usage

```typescript
import { dbConnect } from "@/lib/config/mongo";

export async function GET() {
  await dbConnect();
  const students = await Student.find();
  return Response.json(students);
}
```

---

## Student Model

**Location:** `src/models/Student.ts`

### Schema

```typescript
{
  // Basic Information
  firstName: String,           // Required, trimmed
  lastName: String,            // Required, trimmed
  birthName: String,           // Trimmed
  dateOfBirth: Date,           // Required
  gender: String,              // Enum: "male" | "female" | "diverse" (default: undefined)
  birthplace: String,          // Trimmed
  birthCountry: String,        // Trimmed
  religion: String,            // Trimmed
  nationality: String,         // Trimmed
  secondNationality: String,   // Trimmed
  familyLanguage: String,      // Trimmed
  immigrationYear: Number,

  // Normalized Search (computed in the API layer, see "Name Normalization")
  firstNameNorm: String,       // Required, indexed (index: true)
  lastNameNorm: String,        // Required, indexed (index: true)

  // Contact
  email: String,               // Trimmed, lowercase
  phone: String,               // Trimmed
  address: {                   // AddressSchema, default: undefined
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    timezone: String           // Enum of all timezones, default: DE timezone (Europe/Berlin)
  },

  // Collision Handling
  collisionGroup: String,      // Indexed (index: true), for duplicates
  ordinal: Number,             // Default: 1, indexed (index: true)

  // Status
  status: String,              // Enum: "imported" | "invited" | "onboarded" (default: "imported")

  // Verification
  verificationCode: String,    // Unique, sparse, indexed, trimmed, uppercase, match /^[0-9A-Z]{6}$/

  // Class
  currentClass: ObjectId,      // Ref: 'Class', default: null
  currentClassName: String,    // Trimmed
  schoolEntryDate: Date,
  classHistory: [{             // Default: []
    classId: ObjectId,         // Required, ref: 'Class'
    schoolYear: String,        // Required
    startDate: Date,           // Required
    endDate: Date,             // Default: null
    note: String               // Default: ""
  }],

  // Previous Schooling
  previousSchool: String,      // Trimmed
  previousSchoolType: String,  // Trimmed
  previousSchoolLevel: String, // Trimmed
  degrees: String,             // Trimmed

  // Vocational
  profession: String,          // Trimmed
  trainingStartDate: Date,

  // Employer (vocational) - EmployerSchema, default: undefined
  employer: {
    companyName: String,       // Default: ""
    address: String,           // Default: ""
    contactName: String,       // Default: ""
    contactEmail: String,      // Default: ""
    contactPhone: String,      // Default: ""
    contactSalutation: String, // Default: ""
    // Second contact (optional)
    contact2Name: String,      // Default: ""
    contact2Email: String,     // Default: ""
    contact2Phone: String,     // Default: ""
    contact2Salutation: String,// Default: ""
    verified: Boolean          // Default: false
  },

  // Contact Persons - ContactPersonSchema[], default: []
  contactPersons: [{
    type: String,              // Required
    firstName: String,         // Required
    lastName: String,          // Required
    phone: String,
    mobile: String,
    address: {                 // AddressSchema, default: undefined
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      timezone: String
    }
  }],

  // Agreements - AgreementsSchema, default: undefined
  agreements: {
    dataProtection: Boolean,     // Required
    classParticipation: Boolean, // Required
    schoolRules: Boolean,        // Required
    imageRights: Boolean,        // Required
    teamsUsage: Boolean          // Required
  },

  // Onboarding Progress
  onboardingStep: Number,      // Default: 0
  previousStep: Number,        // Default: null

  // Metadata
  active: Boolean,             // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Name Normalization

Names are normalized for reliable searching. The `firstNameNorm` / `lastNameNorm`
fields are **not** auto-generated by a schema hook — they are computed in the API
layer (the `shapeStudent` helper calls `norm()` when building the document, see
`src/app/api/students/route.ts` around lines 193-194).

```typescript
// Input: "Müller", "SCHMIDT", "O'Brien"
// Normalized: "muller", "schmidt", "o'brien"
```

Uses `norm()` from `src/lib/config/norm.ts`. `norm` is an arrow const that
delegates to `deburr` (which uses `.normalize("NFKD")`), and it also trims,
lowercases, and collapses runs of whitespace:

```typescript
export const deburr = (s: string) =>
  s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

export const norm = (s: string) =>
  deburr(
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " "),
  );
```

### Status Values

| Status      | Description               |
| ----------- | ------------------------- |
| `imported`  | Data imported, no account |
| `invited`   | Invitation sent           |
| `onboarded` | Onboarding completed      |

### Indexes

```typescript
// Compound index for name + DOB
StudentSchema.index({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });

// Partial index for active students in classes
StudentSchema.index(
  { currentClass: 1 },
  { partialFilterExpression: { active: true } },
);
```

In addition to the explicitly declared indexes above, several single-field
indexes are created inline via `index: true` on the field definitions:

- `firstNameNorm` (`index: true`)
- `lastNameNorm` (`index: true`)
- `collisionGroup` (`index: true`)
- `ordinal` (`index: true`)
- `verificationCode` — unique sparse index (`unique: true, sparse: true, index: true`)

### Pre-save Hooks

The Student schema registers **two** separate `pre("save")` hooks.

**1. Verification code generation** — generates a unique `verificationCode`, but
only for brand-new documents (`this.isNew` and no code yet), to avoid modifying
paths on updates:

```typescript
StudentSchema.pre("save", async function () {
  // Only generate verification code for NEW documents
  if (!this.verificationCode && this.isNew) {
    const checkExists = async (code) => {
      const Model = this.constructor;
      const existing = await Model.findOne({ verificationCode: code }).lean();
      return !!existing;
    };
    this.verificationCode = await generateUniqueVerificationCode(checkExists);
  }
});
```

**2. Employer info validation** — this hook does **not** validate unconditionally.
It inspects the modified paths and only enforces employer info when the status is
being changed to `"onboarded"` (onboarding completion). It explicitly **skips**
when the only substantive change is `currentClass` (or `currentClass` together with
`classHistory`) — i.e. an admin class assignment:

```typescript
StudentSchema.pre("save", async function () {
  const modifiedPaths = this.modifiedPaths();

  // Ignore timestamps and the auto-generated verificationCode
  const substantiveChanges = modifiedPaths.filter(
    (path) =>
      path !== "updatedAt" &&
      path !== "createdAt" &&
      path !== "verificationCode",
  );

  // Skip admin class assignment (only currentClass changed)
  if (
    substantiveChanges.length === 1 &&
    substantiveChanges[0] === "currentClass"
  ) {
    return;
  }
  // Skip admin assignment (currentClass + classHistory changed together)
  if (
    substantiveChanges.length === 2 &&
    substantiveChanges.includes("currentClass") &&
    substantiveChanges.includes("classHistory")
  ) {
    return;
  }

  // Only validate when status is being changed to "onboarded"
  const isOnboardingCompletion =
    this.isModified("status") && this.status === "onboarded";
  if (!isOnboardingCompletion) return;
  if (!this.currentClass) return;

  const ClassModel = mongoose.model(SCHEMA.CLASS);
  const classDoc = await ClassModel.findById(this.currentClass).lean();
  if (classDoc && !Array.isArray(classDoc) && classDoc.requiresEmployerInfo) {
    const e = this.employer || {};
    const ok = e.companyName && e.contactName && e.contactEmail;
    if (!ok) {
      throw new Error("Employer info required for this class");
    }
  }
});
```

---

## Class Model

**Location:** `src/models/Class.ts`

### Schema

```typescript
{
  // School Year
  schoolYearFrom: Date,        // Required, before schoolYearTo
  schoolYearTo: Date,          // Required, after schoolYearFrom

  // Class Info
  name: String,                // Required (e.g., "10A", "IT-BS-1")
  grade: Number,               // Nullable (default: null); API validates 1-14

  // Vocational Flags
  isVocational: Boolean,       // Default: false
  requiresEmployerInfo: Boolean, // Default: false

  // Metadata
  studentCount: Number,        // Default: 0
  active: Boolean,             // Default: true, required
  incomplete: Boolean,         // Default: false, indexed; derived from grade in pre("save")

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Hooks

**Pre-save** — derives the `incomplete` flag from `grade` (true when `grade` is
`null`/`undefined`, otherwise false):

```typescript
ClassSchema.pre("save", function (next) {
  this.incomplete = this.grade === null || this.grade === undefined;
  next();
});
```

**Pre-validate** — ensures school year dates are present and ordered. The error
messages are in German:

```typescript
ClassSchema.pre("validate", function (next) {
  const from = this.get("schoolYearFrom");
  const to = this.get("schoolYearTo");

  if (!from || !to)
    return next(
      new Error("schoolYearFrom und schoolYearTo sind erforderlich."),
    );
  if (to <= from)
    return next(new Error("schoolYearTo muss NACH schoolYearFrom liegen."));
  next();
});
```

### Indexes

```typescript
// Unique constraint on school year + name
ClassSchema.index(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true },
);
```

Prevents duplicate class names in same school year.

---

## Data Normalization

### Normalization Function

**Location:** `src/lib/config/norm.ts`

### Examples

| Original   | Normalized |
| ---------- | ---------- |
| Müller     | muller     |
| Öztürk     | ozturk     |
| O'Brien    | o'brien    |
| SCHMIDT    | schmidt    |
| José María | jose maria |

### Usage in API

```typescript
// src/app/api/students/route.ts
const student = {
  firstName: "Müller",
  lastName: "SCHMIDT",
  firstNameNorm: norm("Müller"), // "muller"
  lastNameNorm: norm("SCHMIDT"), // "schmidt"
};
```

### Search Queries

Always search using normalized fields:

```typescript
const students = await Student.find({
  firstNameNorm: norm(searchFirstName),
  lastNameNorm: norm(searchLastName),
});
```

---

## Pagination

Both models register the `mongoose-paginate-v2` plugin, so a `.paginate()` method
is available:

```typescript
// Illustrative — the plugin is registered, so this method exists.
// NOTE: the actual list endpoints do NOT use .paginate(); see below.
const result = await Student.paginate(
  { active: true },
  { page: 1, limit: 20 }
);

const result = await Class.paginate(
  { active: true },
  { page: 1, limit: 20, sort: { name: 1 } }
);
```

> **Reality check:** Although the plugin is registered on both schemas, the real
> list endpoints (e.g. `src/app/api/students/route.ts`, `src/app/api/classes/route.ts`)
> do **not** call `.paginate()`. They paginate manually using
> `.find().skip().limit()` together with `countDocuments()`. The `.paginate()`
> examples here are illustrative of the plugin API, not the route code.

---

## Best Practices

### 1. Use Normalized Fields for Search

```typescript
// ✅ Good
const students = await Student.find({
  firstNameNorm: norm(query.firstName)
});

// ❌ Bad
const students = await Student.find({
  firstName: query.firstName  // Won't match case variations
});
```

### 2. Use Lean Queries

```typescript
// ✅ Good - Returns plain objects
const classes = await Class.find().lean();

// ❌ Bad - Returns Mongoose documents (slower)
const classes = await Class.find();
```

### 3. Handle Employer Info

```typescript
// Creating vocational student
const student = new Student({
  firstName: "Max",
  lastName: "Mustermann",
  currentClass: vocationalClassId,
  employer: {
    companyName: "Tech GmbH",
    contactName: "Dr. Schmidt",
    contactEmail: "schmidt@techgmbh.de",
  },
});

await student.save(); // Validates employer info
```

### 4. Use Pagination

Always paginate large result sets rather than fetching everything. The actual list
endpoints do this manually with `.find().skip().limit()` + `countDocuments()`
(the `.paginate()` form below is illustrative of the registered plugin API):

```typescript
// ✅ Good - manual pagination as used by the route handlers
const page = 1;
const limit = 20;
const filter = { active: true };
const [items, total] = await Promise.all([
  Student.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(),
  Student.countDocuments(filter),
]);

// ❌ Bad - Can return thousands
const students = await Student.find({ active: true });
```

---

## Timestamps

All models have automatic timestamps:

```typescript
{
  createdAt: Date,  // Set on creation
  updatedAt: Date   // Updated on every save
}
```

Enabled by `{ timestamps: true }` in schema options.

---

## Schema Options

All models disable version key:

```typescript
const StudentSchema = new Schema(
  {/* fields */},
  { versionKey: false, timestamps: true },
);
```

This removes the `__v` field from documents.
