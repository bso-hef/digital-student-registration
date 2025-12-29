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

- Connection pooling with global caching
- Retry logic with exponential backoff
- Event listeners for state tracking

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
  dateOfBirth: Date,           // Required

  // Normalized Search (auto-generated)
  firstNameNorm: String,       // Indexed, lowercase, no diacritics
  lastNameNorm: String,        // Indexed, lowercase, no diacritics

  // Contact
  email: String,               // Lowercase
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    timezone: String           // Auto-detected, default: Europe/Berlin
  },

  // Collision Handling
  collisionGroup: String,      // Indexed, for duplicates
  ordinal: Number,             // Default: 1

  // Status
  status: String,              // "imported" | "invited" | "onboarded"

  // Class
  currentClass: ObjectId,      // Ref: 'Class'
  classHistory: [{
    classId: ObjectId,
    schoolYear: String,
    startDate: Date,
    endDate: Date,
    note: String
  }],

  // Employer (vocational)
  employer: {
    companyName: String,
    address: String,
    contactName: String,
    contactEmail: String,
    verified: Boolean          // Default: false
  },

  // Metadata
  active: Boolean,             // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Name Normalization

Names normalized for reliable searching:

```typescript
// Input: "Müller", "SCHMIDT", "O'Brien"
// Normalized: "muller", "schmidt", "o'brien"
```

Uses `norm()` from `src/lib/config/norm.ts`:

```typescript
export function norm(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
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

// Collision group
StudentSchema.index({ collisionGroup: 1 });

// Ordinal
StudentSchema.index({ ordinal: 1 });
```

### Validation Hook

Pre-save hook enforces employer info for vocational classes:

```typescript
StudentSchema.pre("save", async function () {
  if (!this.currentClass) return;

  const classDoc = await ClassModel.findById(this.currentClass).lean();

  if (classDoc?.requiresEmployerInfo) {
    const hasEmployerInfo =
      this.employer?.companyName &&
      this.employer?.contactName &&
      this.employer?.contactEmail;

    if (!hasEmployerInfo) {
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
  grade: Number,               // Nullable, 1-13

  // Vocational Flags
  isVocational: Boolean,       // Default: false
  requiresEmployerInfo: Boolean, // Default: false

  // Metadata
  studentCount: Number,        // Default: 0
  active: Boolean,             // Default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Validation Hook

Pre-validate ensures school year dates are valid:

```typescript
ClassSchema.pre("validate", function (next) {
  const from = this.get("schoolYearFrom");
  const to = this.get("schoolYearTo");

  if (!from || !to) {
    return next(new Error("schoolYearFrom and schoolYearTo are required"));
  }

  if (to <= from) {
    return next(new Error("schoolYearTo must be AFTER schoolYearFrom"));
  }

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

Both models use `mongoose-paginate-v2`:

```typescript
// Student pagination
const result = await Student.paginate(
  { active: true },
  { page: 1, limit: 20 }
);

// Class pagination
const result = await Class.paginate(
  { active: true },
  { page: 1, limit: 20, sort: { name: 1 } }
);
```

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

```typescript
// ✅ Good
const result = await Student.paginate({ active: true }, { page: 1, limit: 20 });

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
  {
    /* fields */
  },
  { versionKey: false, timestamps: true },
);
```

This removes the `__v` field from documents.
