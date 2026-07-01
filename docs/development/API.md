# API Reference

API documentation for Digital Student Registration. This document covers the
most commonly used endpoints; see [Other Endpoints](#other-endpoints) for the
full list of available routes.

## Overview

Next.js API Routes in `src/app/api/` as REST backend.

**Base URL:** `http://localhost:3000/api`
**Content-Type:** `application/json`

Most endpoints require an authenticated session and return `401 Unauthorized`
with `{ "message": "Unauthorized" }` when called without one.

---

## Classes API

### List Classes

```http
GET /api/classes?page=1&limit=25
```

**Query Parameters:**

| Param   | Type   | Default | Validation     |
| ------- | ------ | ------- | -------------- |
| `page`  | number | 1       | Min 1          |
| `limit` | number | 25      | Min 1, max 200 |

**Response:**

```json
{
  "classes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "schoolYearFrom": "2024-09-01T00:00:00.000Z",
      "schoolYearTo": "2025-07-31T00:00:00.000Z",
      "name": "10A",
      "grade": 10,
      "isVocational": false,
      "requiresEmployerInfo": false,
      "studentCount": 25,
      "active": true,
      "incomplete": false
    }
  ],
  "page": 1,
  "limit": 25,
  "total": 42,
  "pages": 2
}
```

### Create Classes (Batch)

```http
POST /api/classes
```

**Request:**

```json
{
  "classes": [
    {
      "schoolYearFrom": "2024-09-01",
      "schoolYearTo": "2025-07-31",
      "name": "10A",
      "grade": 10,
      "isVocational": false,
      "requiresEmployerInfo": false,
      "active": true
    }
  ]
}
```

**Validation:**

| Field                  | Type    | Required | Validation             |
| ---------------------- | ------- | -------- | ---------------------- |
| `schoolYearFrom`       | Date    | Yes      | Valid date             |
| `schoolYearTo`         | Date    | Yes      | After `schoolYearFrom` |
| `name`                 | string  | Yes      | Non-empty              |
| `grade`                | number  | No       | Integer 1-14 or null   |
| `isVocational`         | boolean | No       | Default: false         |
| `requiresEmployerInfo` | boolean | No       | Default: false         |
| `active`               | boolean | No       | Default: true          |

**Response:** `201 Created`

```json
{
  "classes": [{/* class object, same shape as List Classes */}],
  "createdCount": 1,
  "invalidCount": 0,
  "errors": []
}
```

Invalid rows are counted in `invalidCount` and described in `errors`
(`[{ "index": 0, "reason": "..." }]`); they are not inserted. If no rows are
valid the endpoint returns `400` with `{ message, invalidCount, errors }`.

### Get Single Class

```http
GET /api/classes/[classId]
```

Returns the class object (including the computed `incomplete` field), or `404`
with `{ "message": "Class not found" }`.

### Update Class

```http
PATCH /api/classes/[classId]
```

**Request:**

```json
{
  "name": "10B",
  "active": false
}
```

Returns the updated class object.

### Delete Classes (Batch)

```http
DELETE /api/classes
```

There is no single-class delete endpoint; deletion is always done in batch.

**Request:**

```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response:**

```json
{
  "deletedCount": 2
}
```

### Get Class Students

```http
GET /api/classes/[classId]/students
```

---

## Students API

### List Students

```http
GET /api/students?page=1&limit=25
```

**Query Parameters:**

| Param           | Type    | Default | Validation                       |
| --------------- | ------- | ------- | -------------------------------- |
| `page`          | number  | 1       | Min 1                            |
| `limit`         | number  | 25      | Min 1, max 200                   |
| `unassigned`    | boolean | false   | `true` = only unassigned/active  |
| `forAssignment` | boolean | false   | `true` = all active, name-sorted |

**Response:**

```json
{
  "students": [
    {
      "_id": "507f191e810c19729de860ea",
      "firstName": "Max",
      "lastName": "Mustermann",
      "firstNameNorm": "max",
      "lastNameNorm": "mustermann",
      "dateOfBirth": "2010-05-15T00:00:00.000Z",
      "email": "max.mustermann@example.com",
      "phone": "+49 123 456789",
      "address": {
        "street": "Hauptstraße 1",
        "city": "Berlin",
        "zip": "10115"
      },
      "status": "imported",
      "currentClass": "507f1f77bcf86cd799439011",
      "verificationCode": "ABC123"
    }
  ],
  "page": 1,
  "limit": 25,
  "total": 150,
  "pages": 6
}
```

### Create Students (Batch)

```http
POST /api/students
```

**Request:**

```json
{
  "students": [
    {
      "firstName": "Max",
      "lastName": "Mustermann",
      "dateOfBirth": "2010-05-15",
      "email": "max.mustermann@example.com",
      "phone": "+49 123 456789",
      "address": {
        "street": "Hauptstraße 1",
        "city": "Berlin",
        "zip": "10115"
      },
      "className": "10A"
    }
  ]
}
```

**Validation:**

| Field         | Type   | Required | Validation                       |
| ------------- | ------ | -------- | -------------------------------- |
| `firstName`   | string | Yes      | Non-empty, trimmed               |
| `lastName`    | string | Yes      | Non-empty, trimmed               |
| `dateOfBirth` | Date   | Yes      | Valid date                       |
| `email`       | string | No       | Lowercased                       |
| `phone`       | string | No       | Trimmed (falls back to `mobile`) |
| `className`   | string | No       | Linked to a class by name        |
| `employer`    | object | No       | See below                        |

A new record is created with `status: "imported"` and a generated
`verificationCode`. If a `className` matches an existing class, the student's
`currentClass` is linked automatically.

**Employer Object (optional):**

```json
{
  "companyName": "Tech GmbH",
  "address": "Industriestraße 10, 12345 Stadt",
  "contactName": "Dr. Schmidt",
  "contactEmail": "schmidt@techgmbh.de",
  "contactPhone": "+49 123 456789",
  "contactSalutation": "Herr"
}
```

> **Note:** `employer` is not required by this import endpoint. Employer
> details are only enforced (for vocational students) by the `Student`
> model's pre-save hook when onboarding is completed.

**Response:** `201 Created`

```json
{
  "created": [{/* student object */}],
  "createdCount": 1,
  "invalidCount": 0
}
```

Invalid rows are only counted in `invalidCount`; they are not returned with
per-record error messages. If no rows are valid the endpoint returns `400`
with `{ message, invalid }`.

### Delete Students (Batch)

```http
DELETE /api/students
```

**Request:**

```json
{
  "ids": ["507f191e810c19729de860ea", "507f191e810c19729de860eb"]
}
```

**Response:**

```json
{
  "deletedCount": 2
}
```

---

## Dashboard API

### Get Dashboard Stats

```http
GET /api/dashboard/stats
```

**Response:**

```json
{
  "quickStats": {
    "totalStudents": 150,
    "totalClasses": 14,
    "unassignedStudents": 8,
    "activeClasses": 12,
    "onboardingProgress": {
      "total": 150,
      "onboarded": 137,
      "percentage": 91
    }
  },
  "studentStatusBreakdown": {
    "imported": 8,
    "invited": 5,
    "onboarded": 137,
    "other": 0
  },
  "gradeDistribution": [
    { "grade": 10, "count": 45 },
    { "grade": 11, "count": 38 }
  ],
  "registrationTrend": [
    { "date": "2024-09-01", "count": 5 },
    { "date": "2024-09-08", "count": 12 }
  ],
  "timestamp": "2024-10-26T14:30:00.000Z"
}
```

`registrationTrend` always contains exactly 7 entries (one per day for the last
7 days, zero-filled).

---

## Health API

### Liveness Check

```http
GET /api/health/live
```

**Response:**

```json
{
  "status": "up"
}
```

### Full Health Check

```http
GET /api/health/full
```

Requires authentication; returns `401` with `{ "error": "Unauthorized" }` when
called without a session. Returns `200` when all critical checks are up,
otherwise `503`.

**Response:**

```json
{
  "status": "up",
  "checks": {
    "mongo": { "status": "up", "info": { "code": 1 } },
    "redis": { "status": "up" }
  },
  "meta": {
    "service": "digital-student-onboarding",
    "version": "2.1.0",
    "environment": "production",
    "now": "2024-10-26T14:30:00.000Z",
    "uptimeSec": 13522,
    "node": "v20.11.0",
    "system": {
      "hostname": "app-01",
      "platform": "linux",
      "arch": "x64",
      "cpus": 4,
      "loadavg": [0.1, 0.2, 0.15],
      "freemem": "2.1 GB",
      "totalmem": "8 GB"
    }
  }
}
```

`status` is `"up"` or `"down"`. In development only `mongo` is critical; in
production both `mongo` and `redis` are critical.

---

## Error Handling

### Error Response Format

Most endpoints return errors as a single `message` field:

```json
{
  "message": "Unauthorized"
}
```

### HTTP Status Codes

| Code | Meaning               | Description        |
| ---- | --------------------- | ------------------ |
| 200  | OK                    | Request succeeded  |
| 201  | Created               | Resource created   |
| 400  | Bad Request           | Invalid parameters |
| 401  | Unauthorized          | No/invalid session |
| 404  | Not Found             | Resource not found |
| 500  | Internal Server Error | Server error       |

### Example Error

```json
{
  "message": "schoolYearTo must be after schoolYearFrom"
}
```

---

## Pagination

The Classes and Students list endpoints use `page` and `limit` query params:

```http
GET /api/students?page=3&limit=10
```

Returns the third page of 10 students each.

- `page` defaults to `1` (minimum `1`).
- `limit` defaults to `25` (minimum `1`, maximum `200`).

**Response Format:**

```json
{
  "students": [...],
  "page": 3,
  "limit": 10,
  "total": 150,
  "pages": 15
}
```

`pages = Math.ceil(total / limit)`.

---

## Validation Patterns

The batch create endpoints use shaping functions that return a discriminated
result and separate invalid rows before insertion:

```typescript
type ShapedResult =
  { ok: true; doc: ValidatedDocument } | { ok: false; reason: string };
```

Used in:

- `shapeClass()` - `src/app/api/classes/route.ts`
- `shapeStudent()` - `src/app/api/students/route.ts`

For classes, invalid rows are reported in the `errors` array
(`{ index, reason }`). For students, invalid rows are only counted in
`invalidCount`.

---

## Other Endpoints

The following routes also exist and follow the same conventions (session auth,
`{ message }` errors). They are not documented in detail here:

- `GET` / `POST` / `DELETE` `/api/classes/[classId]/students` - manage students in a class
- `/api/classes/check` - class existence/validation check
- `/api/classes/recalculate-counts` - recompute `studentCount` for classes
- `GET` / `PATCH` / `DELETE` `/api/students/[id]` - single student
- `/api/students/[id]/onboarding` - student onboarding data
- `/api/students/check-duplicate` - duplicate detection
- `/api/students/verify` - verification-code lookup
- `/api/dashboard/activity` - recent activity feed
- `/api/settings` (+ `/agreements`, `/onboarding`) - application settings
- `/api/audit-logs` (+ `/stats`, `/export`, `/delete`) - audit log access
- `/api/auth/*` - authentication (`setup`, `profile`, `reset-password`, NextAuth handler)
