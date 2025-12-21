# API Reference

Complete API documentation for the Digital Student Registration application.

## Table of Contents

- [Overview](#overview)
- [Classes API](#classes-api)
- [Students API](#students-api)
- [Dashboard API](#dashboard-api)
- [Health API](#health-api)
- [Error Handling](#error-handling)
- [Pagination](#pagination)

---

## Overview

The application uses **Next.js API Routes** located in `src/app/api/` as the backend. All endpoints return JSON responses and use REST conventions.

### Base URL

```text
http://localhost:3000/api
```

### Content Type

All requests and responses use `application/json`.

---

## Classes API

Manage educational classes with support for grades 1-13 and vocational programs.

### List Classes

```http
GET /api/classes
```

Get a paginated list of all classes.

**Query Parameters:**

| Parameter | Type     | Default | Description                 |
| --------- | -------- | ------- | --------------------------- |
| `skip`    | `number` | `0`     | Number of records to skip   |
| `limit`   | `number` | `20`    | Number of records to return |

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
      "createdAt": "2024-08-15T10:30:00.000Z",
      "updatedAt": "2024-08-15T10:30:00.000Z"
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

Create one or multiple classes in a single request.

**Request Body:**

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

**Field Validation:**

| Field                  | Type      | Required | Validation                     |
| ---------------------- | --------- | -------- | ------------------------------ |
| `schoolYearFrom`       | `Date`    | Yes      | Valid date                     |
| `schoolYearTo`         | `Date`    | Yes      | Must be after `schoolYearFrom` |
| `name`                 | `string`  | Yes      | Non-empty string               |
| `grade`                | `number`  | No       | Integer 1-13 or null           |
| `isVocational`         | `boolean` | No       | Default: `false`               |
| `requiresEmployerInfo` | `boolean` | No       | Default: `false`               |
| `active`               | `boolean` | No       | Default: `true`                |

**Response:**

```json
{
  "created": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "schoolYearFrom": "2024-09-01T00:00:00.000Z",
      "schoolYearTo": "2025-07-31T00:00:00.000Z",
      "name": "10A",
      "grade": 10,
      "isVocational": false,
      "requiresEmployerInfo": false,
      "studentCount": 0,
      "active": true,
      "createdAt": "2024-08-15T10:30:00.000Z",
      "updatedAt": "2024-08-15T10:30:00.000Z"
    }
  ],
  "failed": []
}
```

### Get Single Class

```http
GET /api/classes/[classId]
```

Retrieve details of a specific class.

**Response:**

```json
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
  "createdAt": "2024-08-15T10:30:00.000Z",
  "updatedAt": "2024-08-15T10:30:00.000Z"
}
```

### Update Class

```http
PATCH /api/classes/[classId]
```

Update an existing class.

**Request Body:**

```json
{
  "name": "10B",
  "grade": 10,
  "active": false
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "schoolYearFrom": "2024-09-01T00:00:00.000Z",
  "schoolYearTo": "2025-07-31T00:00:00.000Z",
  "name": "10B",
  "grade": 10,
  "isVocational": false,
  "requiresEmployerInfo": false,
  "studentCount": 25,
  "active": false,
  "createdAt": "2024-08-15T10:30:00.000Z",
  "updatedAt": "2024-10-26T14:25:00.000Z"
}
```

### Delete Class

```http
DELETE /api/classes/[classId]
```

Delete a single class.

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

Delete multiple classes by IDs.

**Request Body:**

```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response:**

```json
{
  "deletedCount": 2,
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

### Get Class Students

```http
GET /api/classes/[classId]/students
```

Get all students enrolled in a specific class.

**Response:**

```json
{
  "students": [
    {
      "_id": "507f191e810c19729de860ea",
      "firstName": "Max",
      "lastName": "Mustermann",
      "dateOfBirth": "2010-05-15T00:00:00.000Z",
      "email": "max.mustermann@example.com",
      "status": "onboarded",
      "currentClass": "507f1f77bcf86cd799439011"
    }
  ],
  "total": 25
}
```

---

## Students API

Manage student records with normalized search and class history tracking.

### List Students

```http
GET /api/students
```

Get a paginated list of all students.

**Query Parameters:**

| Parameter | Type     | Default | Description                 |
| --------- | -------- | ------- | --------------------------- |
| `skip`    | `number` | `0`     | Number of records to skip   |
| `limit`   | `number` | `20`    | Number of records to return |

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
        "state": "Berlin",
        "zip": "10115",
        "country": "DE",
        "timezone": "Europe/Berlin"
      },
      "status": "onboarded",
      "currentClass": "507f1f77bcf86cd799439011",
      "classHistory": [],
      "active": true,
      "createdAt": "2024-08-15T10:30:00.000Z",
      "updatedAt": "2024-08-15T10:30:00.000Z"
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

Create one or multiple students. Name normalization happens automatically.

**Request Body:**

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
        "state": "Berlin",
        "zip": "10115",
        "country": "DE"
      },
      "currentClass": "507f1f77bcf86cd799439011",
      "status": "imported"
    }
  ]
}
```

**Field Validation:**

| Field          | Type       | Required    | Validation                            |
| -------------- | ---------- | ----------- | ------------------------------------- |
| `firstName`    | `string`   | Yes         | Non-empty, trimmed                    |
| `lastName`     | `string`   | Yes         | Non-empty, trimmed                    |
| `dateOfBirth`  | `Date`     | Yes         | Valid date                            |
| `email`        | `string`   | No          | Valid email format, lowercase         |
| `phone`        | `string`   | No          | Trimmed                               |
| `address`      | `object`   | No          | Address schema                        |
| `currentClass` | `ObjectId` | No          | Valid class ID                        |
| `status`       | `string`   | No          | `imported`, `invited`, or `onboarded` |
| `employer`     | `object`   | Conditional | Required if in vocational class       |

**Employer Object (for vocational students):**

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
      "_id": "507f191e810c19729de860ea",
      "firstName": "Max",
      "lastName": "Mustermann",
      "firstNameNorm": "max",
      "lastNameNorm": "mustermann",
      "dateOfBirth": "2010-05-15T00:00:00.000Z",
      "email": "max.mustermann@example.com",
      "status": "imported",
      "active": true,
      "createdAt": "2024-08-15T10:30:00.000Z",
      "updatedAt": "2024-08-15T10:30:00.000Z"
    }
  ],
  "failed": []
}
```

### Delete Students (Batch)

```http
DELETE /api/students
```

Delete multiple students by IDs.

**Request Body:**

```json
{
  "ids": ["507f191e810c19729de860ea", "507f191e810c19729de860eb"]
}
```

**Response:**

```json
{
  "deletedCount": 2,
  "ids": ["507f191e810c19729de860ea", "507f191e810c19729de860eb"]
}
```

---

## Dashboard API

Retrieve dashboard statistics and metrics.

### Get Dashboard Stats

```http
GET /api/dashboard/stats
```

Get comprehensive statistics for the admin dashboard.

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
    { "grade": 11, "count": 38 },
    { "grade": 12, "count": 42 },
    { "grade": 13, "count": 25 }
  ],
  "studentsByStatus": {
    "imported": 8,
    "invited": 5,
    "onboarded": 137
  },
  "registrationTrend": [
    { "date": "2024-09-01", "count": 5 },
    { "date": "2024-09-08", "count": 12 },
    { "date": "2024-09-15", "count": 8 }
  ]
}
```

---

## Health API

System health and readiness checks.

### Liveness Check

```http
GET /api/health/live
```

Quick health check for the application.

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

Comprehensive health check including database connectivity.

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

All endpoints return consistent error responses.

### Error Response Format

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common HTTP Status Codes

| Code | Meaning               | Description                        |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Request succeeded                  |
| 201  | Created               | Resource created successfully      |
| 400  | Bad Request           | Invalid request body or parameters |
| 404  | Not Found             | Resource not found                 |
| 500  | Internal Server Error | Server error occurred              |

### Example Error Response

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

All list endpoints support pagination using `skip` and `limit` query parameters.

### Example

```http
GET /api/students?skip=20&limit=10
```

Returns students 21-30.

### Response Format

```json
{
  "students": [...],
  "total": 150,
  "page": 3,
  "pages": 15
}
```

### Calculation

- `page` = `(skip / limit) + 1`
- `pages` = `Math.ceil(total / limit)`

---

## Validation Patterns

The API uses validation functions that return structured results:

```typescript
type ValidationResult =
  | { ok: true; doc: ValidatedDocument }
  | { ok: false; reason: string };
```

This pattern is used in:

- `shapeClass()` - src/app/api/classes/route.ts:49
- `shapeStudent()` - src/app/api/students/route.ts:52

Invalid records are separated before database insertion and returned in the `failed` array with detailed error messages.
