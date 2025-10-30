# Database Documentation

Complete database schema and model documentation for MongoDB with Mongoose.

## Table of Contents

- [Overview](#overview)
- [Connection Management](#connection-management)
- [Student Model](#student-model)
- [Class Model](#class-model)
- [AppSettings Model](#appsettings-model)
- [Indexes](#indexes)
- [Data Normalization](#data-normalization)
- [Validation Hooks](#validation-hooks)

---

## Overview

The application uses **MongoDB** with **Mongoose 8.18.0** for data persistence. Models are defined in `src/models/`.

### Database URI

```env
MONGODB_URI=mongodb://localhost:27017/digital-student-onboarding
```

### Schemas

- **Student** - Student records with normalized search fields
- **Class** - Educational classes with school year validation
- **AppSettings** - Application configuration (not yet fully implemented)

---

## Connection Management

### Location

`src/lib/config/mongo.ts`

### Features

- **Connection Pooling** - Global caching for serverless optimization
- **Retry Logic** - Exponential backoff on connection failures
- **Event Listeners** - Connection state tracking

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

### Location

`src/models/Student.ts`

### Schema

```typescript
{
  // Basic Information
  firstName: String,        // Required, trimmed
  lastName: String,         // Required, trimmed
  dateOfBirth: Date,        // Required

  // Normalized Search Fields (auto-generated)
  firstNameNorm: String,    // Required, indexed, lowercase, no diacritics
  lastNameNorm: String,     // Required, indexed, lowercase, no diacritics

  // Contact Information
  email: String,            // Trimmed, lowercase
  phone: String,            // Trimmed
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    timezone: String        // Auto-detected from country, default: Europe/Berlin
  },

  // Collision Handling (for duplicate names)
  collisionGroup: String,   // Indexed, for grouping duplicates
  ordinal: Number,          // Default: 1, indexed

  // Status
  status: String,           // Enum: ['imported', 'invited', 'onboarded']
                           // Default: 'imported'

  // Class Assignment
  currentClass: ObjectId,   // Ref: 'Class', nullable
  classHistory: [{
    classId: ObjectId,      // Ref: 'Class', required
    schoolYear: String,     // Required
    startDate: Date,        // Required
    endDate: Date,          // Nullable
    note: String           // Default: ''
  }],

  // Employer Information (for vocational students)
  employer: {
    companyName: String,
    address: String,
    contactName: String,
    contactEmail: String,
    verified: Boolean       // Default: false
  },

  // Metadata
  active: Boolean,          // Default: true
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

### Field Details

#### Name Normalization

Names are automatically normalized for reliable searching:

```typescript
// Input: "Müller", "SCHMIDT", "O'Brien"
// Normalized: "muller", "schmidt", "o'brien"
```

Normalization removes diacritics and converts to lowercase using the `norm()` function from `src/lib/config/norm.ts`.

#### Address with Timezone

The timezone is automatically detected based on the country code:

```typescript
address: {
  country: 'DE',
  timezone: 'Europe/Berlin'  // Auto-detected
}
```

Uses `countries-and-timezones` package.

#### Status Values

| Status      | Description                             |
| ----------- | --------------------------------------- |
| `imported`  | Student data imported, no account yet   |
| `invited`   | Invitation sent, waiting for onboarding |
| `onboarded` | Onboarding process completed            |

#### Employer Information

Required for students in vocational classes (`requiresEmployerInfo: true`). Validated by pre-save hook.

```typescript
employer: {
  companyName: 'Tech GmbH',
  address: 'Industriestraße 10, 12345 Stadt',
  contactName: 'Dr. Schmidt',
  contactEmail: 'schmidt@techgmbh.de',
  verified: false
}
```

### Indexes

```typescript
// Compound index for efficient name + DOB lookups
StudentSchema.index({ firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 });

// Partial index for active students in classes
StudentSchema.index(
  { currentClass: 1 },
  { partialFilterExpression: { active: true } },
);
```

### Validation Hook

Pre-save hook enforces employer info requirement:

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

### Pagination

The Student model uses `mongoose-paginate-v2`:

```typescript
const result = await Student.paginate({ active: true }, { page: 1, limit: 20 });
```

---

## Class Model

### Location

`src/models/Class.ts`

### Schema

```typescript
{
  // School Year Period
  schoolYearFrom: Date,     // Required, must be before schoolYearTo
  schoolYearTo: Date,       // Required, must be after schoolYearFrom

  // Class Information
  name: String,             // Required, e.g., "10A", "IT-BS-1"
  grade: Number,            // Nullable, integer 1-13

  // Vocational Program Flags
  isVocational: Boolean,    // Default: false
  requiresEmployerInfo: Boolean, // Default: false

  // Metadata
  studentCount: Number,     // Default: 0, updated manually
  active: Boolean,          // Default: true, required

  // Timestamps
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

### Field Details

#### School Year Validation

The school year period is validated by a pre-validate hook:

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

#### Grade Range

- Valid values: `1-13` (integer) or `null`
- `null` is used for non-grade-specific programs

#### Vocational Flags

```typescript
isVocational: true,           // This is a vocational training class
requiresEmployerInfo: true    // Students must provide employer details
```

When `requiresEmployerInfo` is `true`, the Student model's pre-save hook enforces employer information.

### Indexes

```typescript
// Unique constraint on school year + name
ClassSchema.index(
  { schoolYearFrom: 1, schoolYearTo: 1, name: 1 },
  { unique: true },
);
```

This prevents duplicate class names within the same school year period.

### Pagination

The Class model uses `mongoose-paginate-v2`:

```typescript
const result = await Class.paginate(
  { active: true },
  { page: 1, limit: 20, sort: { name: 1 } },
);
```

---

## AppSettings Model

### Location

`src/models/AppSettings.ts`

### Purpose

Stores application-wide configuration settings. Currently a placeholder for future features like:

- Global app settings
- Feature flags
- System-wide defaults
- Onboarding configuration

### Status

Not yet fully implemented. Schema definition exists but is minimal.

---

## Indexes

### Student Indexes

1. **Name + DOB Compound Index**

   ```typescript
   { firstNameNorm: 1, lastNameNorm: 1, dateOfBirth: 1 }
   ```

   - Purpose: Fast lookups by name and birth date
   - Used for duplicate detection

2. **Active Class Index (Partial)**

   ```typescript
   {
     currentClass: 1;
   }
   {
     partialFilterExpression: {
       active: true;
     }
   }
   ```

   - Purpose: Efficient queries for active students in a class
   - Only indexes active students

3. **Collision Group Index**

   ```typescript
   {
     collisionGroup: 1;
   }
   ```

   - Purpose: Grouping students with identical names

4. **Ordinal Index**
   ```typescript
   {
     ordinal: 1;
   }
   ```

   - Purpose: Ordering within collision groups

### Class Indexes

1. **Unique School Year + Name**
   ```typescript
   { schoolYearFrom: 1, schoolYearTo: 1, name: 1 }
   { unique: true }
   ```

   - Purpose: Prevent duplicate class names in same period
   - Enforces business rule at database level

---

## Data Normalization

### Name Normalization Function

Location: `src/lib/config/norm.ts`

```typescript
export function norm(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
```

### Examples

| Original   | Normalized |
| ---------- | ---------- |
| Müller     | muller     |
| Öztürk     | ozturk     |
| O'Brien    | o'brien    |
| SCHMIDT    | schmidt    |
| José María | jose maria |

### Usage in Models

Name normalization happens automatically in API routes before saving to database:

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
// Search for students with normalized names
const students = await Student.find({
  firstNameNorm: norm(searchFirstName),
  lastNameNorm: norm(searchLastName),
});
```

---

## Validation Hooks

### Student Pre-Save Hook

Enforces employer information requirement for vocational classes.

**Location:** `src/models/Student.ts:98-117`

```typescript
StudentSchema.pre("save", async function () {
  if (!this.currentClass) return;

  const ClassModel = mongoose.model(SCHEMA.CLASS);
  const classDoc = await ClassModel.findById(this.currentClass).lean();

  if (classDoc?.requiresEmployerInfo) {
    const e = this.employer || {};
    const hasRequired = e.companyName && e.contactName && e.contactEmail;

    if (!hasRequired) {
      throw new Error("Employer info required for this class");
    }
  }
});
```

### Class Pre-Validate Hook

Validates school year date range.

**Location:** `src/models/Class.ts:22-33`

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

---

## Database Operations

### Generic CRUD Helpers

Location: `src/server/middleware/db.middleware.ts`

Reusable functions for common database operations:

```typescript
// Get single item
const student = await getItem(Student, studentId);

// Get paginated list
const result = await getItems(
  Student,
  { active: true },
  { page: 1, limit: 20 },
);

// Create item
const newStudent = await createItem(Student, studentData);

// Update item
const updated = await updateItem(Student, studentId, updates);

// Delete item
const deleted = await deleteItem(Student, studentId);
```

### Features

- Automatic pagination with `mongoose-paginate-v2`
- Lean queries for better performance
- Population support for references
- Filtering and sorting

---

## Best Practices

### 1. Always Use Normalized Fields for Search

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

### 2. Use Lean Queries When Possible

```typescript
// ✅ Good - Returns plain objects
const classes = await Class.find().lean();

// ❌ Bad - Returns Mongoose documents (slower)
const classes = await Class.find();
```

### 3. Handle Employer Info Correctly

```typescript
// When creating vocational student
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

await student.save(); // Will validate employer info
```

### 4. Use Pagination for Large Lists

```typescript
// ✅ Good
const result = await Student.paginate({ active: true }, { page: 1, limit: 20 });

// ❌ Bad - Can return thousands of records
const students = await Student.find({ active: true });
```

---

## Schema Versions

All models use `versionKey: false` to disable the `__v` field:

```typescript
const StudentSchema = new Schema(
  {
    // fields...
  },
  { versionKey: false, timestamps: true },
);
```

This simplifies the schema and API responses.

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
