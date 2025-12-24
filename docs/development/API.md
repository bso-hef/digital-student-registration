# API Reference

Complete API documentation for Digital Student Registration.

## Overview

Next.js API Routes in `src/app/api/` as REST backend.

**Base URL:** `http://localhost:3000/api`
**Content-Type:** `application/json`

---

## Classes API

### List Classes

```http
GET /api/classes?skip=0&limit=20
```

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
      "active": true
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 3
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
| `grade`                | number  | No       | 1-13 or null           |
| `isVocational`         | boolean | No       | Default: false         |
| `requiresEmployerInfo` | boolean | No       | Default: false         |

**Response:**

```json
{
  "created": [
    {
      /* class object */
    }
  ],
  "failed": []
}
```

### Get Single Class

```http
GET /api/classes/[classId]
```

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

### Delete Class

```http
DELETE /api/classes/[classId]
```

**Response:**

```json
{
  "deleted": true,
  "classId": "507f1f77bcf86cd799439011"
}
```

### Delete Classes (Batch)

```http
DELETE /api/classes
```

**Request:**

```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
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
GET /api/students?skip=0&limit=20
```

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
        "zip": "10115",
        "country": "DE"
      },
      "status": "onboarded",
      "currentClass": "507f1f77bcf86cd799439011",
      "active": true
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
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
        "zip": "10115",
        "country": "DE"
      },
      "currentClass": "507f1f77bcf86cd799439011",
      "status": "imported"
    }
  ]
}
```

**Validation:**

| Field          | Type     | Required    | Validation                         |
| -------------- | -------- | ----------- | ---------------------------------- |
| `firstName`    | string   | Yes         | Non-empty, trimmed                 |
| `lastName`     | string   | Yes         | Non-empty, trimmed                 |
| `dateOfBirth`  | Date     | Yes         | Valid date                         |
| `email`        | string   | No          | Valid email, lowercase             |
| `phone`        | string   | No          | Trimmed                            |
| `currentClass` | ObjectId | No          | Valid class ID                     |
| `status`       | string   | No          | `imported`, `invited`, `onboarded` |
| `employer`     | object   | Conditional | Required if vocational class       |

**Employer Object (vocational students):**

```json
{
  "companyName": "Tech GmbH",
  "address": "Industriestraße 10, 12345 Stadt",
  "contactName": "Dr. Schmidt",
  "contactEmail": "schmidt@techgmbh.de",
  "verified": false
}
```

**Response:**

```json
{
  "created": [
    {
      /* student object */
    }
  ],
  "failed": []
}
```

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
    "activeClasses": 12,
    "pendingOnboarding": 8,
    "completedThisMonth": 25
  },
  "classDistribution": [
    { "grade": 10, "count": 45 },
    { "grade": 11, "count": 38 }
  ],
  "studentsByStatus": {
    "imported": 8,
    "invited": 5,
    "onboarded": 137
  },
  "registrationTrend": [
    { "date": "2024-09-01", "count": 5 },
    { "date": "2024-09-08", "count": 12 }
  ]
}
```

---

## Health API

### Liveness Check

```http
GET /api/health/live
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-10-26T14:30:00.000Z"
}
```

### Full Health Check

```http
GET /api/health/full
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-10-26T14:30:00.000Z",
  "checks": {
    "database": {
      "status": "connected",
      "latency": "5ms"
    },
    "uptime": "3h 45m 22s"
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

| Code | Meaning               | Description        |
| ---- | --------------------- | ------------------ |
| 200  | OK                    | Request succeeded  |
| 201  | Created               | Resource created   |
| 400  | Bad Request           | Invalid parameters |
| 404  | Not Found             | Resource not found |
| 500  | Internal Server Error | Server error       |

### Example Error

```json
{
  "error": "schoolYearTo must be after schoolYearFrom",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "schoolYearTo"
  }
}
```

---

## Pagination

All list endpoints support `skip` and `limit`:

```http
GET /api/students?skip=20&limit=10
```

Returns students 21-30.

**Response Format:**

```json
{
  "students": [...],
  "total": 150,
  "page": 3,
  "pages": 15
}
```

**Calculation:**

- `page = (skip / limit) + 1`
- `pages = Math.ceil(total / limit)`

---

## Validation Patterns

API uses validation functions returning structured results:

```typescript
type ValidationResult =
  | { ok: true; doc: ValidatedDocument }
  | { ok: false; reason: string };
```

Used in:

- `shapeClass()` - src/app/api/classes/route.ts:49
- `shapeStudent()` - src/app/api/students/route.ts:52

Invalid records separated before insertion, returned in `failed` array with error messages.
