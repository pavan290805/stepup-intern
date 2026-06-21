# Backend Architecture (Phase 1 MVP)

## Architecture Style

The backend follows a **Modular Monolith Architecture** using **Node.js, Express.js, TypeScript, and MongoDB**.

This architecture provides:

* Clear separation of concerns
* Easy maintenance
* Feature-based organization
* Scalability
* Future microservice migration support

---

# High Level Flow

```txt
Request
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
MongoDB
```

Controllers should never directly contain business logic.

Services should contain all business rules.

Repositories should handle all database interactions.

Models should only define schema structures and indexes.

---

# Folder Structure

```txt
src/

├── app.ts
├── server.ts

├── config/
│   ├── db.ts
│   ├── cloudinary.ts
│   ├── jwt.ts
│   └── env.ts

├── modules/
│
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   ├── auth.repository.ts
│   │   └── auth.types.ts
│
│   ├── user/
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.validation.ts
│   │   └── user.repository.ts
│
│   ├── student/
│   │   ├── student.model.ts
│   │   ├── student.routes.ts
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   ├── student.validation.ts
│   │   └── student.repository.ts
│
│   ├── recruiter/
│   │   ├── recruiter.model.ts
│   │   ├── recruiter.routes.ts
│   │   ├── recruiter.controller.ts
│   │   ├── recruiter.service.ts
│   │   ├── recruiter.validation.ts
│   │   └── recruiter.repository.ts
│
│   ├── company/
│   │   ├── company.model.ts
│   │   ├── company.routes.ts
│   │   ├── company.controller.ts
│   │   ├── company.service.ts
│   │   ├── company.validation.ts
│   │   └── company.repository.ts
│
│   ├── internship/
│   │   ├── internship.model.ts
│   │   ├── internship.routes.ts
│   │   ├── internship.controller.ts
│   │   ├── internship.service.ts
│   │   ├── internship.validation.ts
│   │   └── internship.repository.ts
│
│   ├── application/
│   │   ├── application.model.ts
│   │   ├── application.routes.ts
│   │   ├── application.controller.ts
│   │   ├── application.service.ts
│   │   ├── application.validation.ts
│   │   └── application.repository.ts
│
│   ├── interview/
│   │   ├── interview.model.ts
│   │   ├── interview.routes.ts
│   │   ├── interview.controller.ts
│   │   ├── interview.service.ts
│   │   ├── interview.validation.ts
│   │   └── interview.repository.ts
│
│   ├── notification/
│   │   ├── notification.model.ts
│   │   ├── notification.routes.ts
│   │   ├── notification.controller.ts
│   │   ├── notification.service.ts
│   │   └── notification.repository.ts
│
│   └── admin/
│       ├── admin.routes.ts
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       └── admin.repository.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── upload.middleware.ts
│   ├── validate.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── error.middleware.ts
│
├── validations/
│   └── schemas/
│       ├── auth.schema.ts
│       ├── user.schema.ts
│       ├── internship.schema.ts
│       └── application.schema.ts
│
├── services/
│   ├── jwt.service.ts
│   ├── cloudinary.service.ts
│   ├── email.service.ts
│   └── notification.service.ts
│
├── types/
│   ├── express.d.ts
│   ├── api.types.ts
│   ├── auth.types.ts
│   └── common.types.ts
│
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   ├── asyncHandler.ts
│   ├── constants.ts
│   └── pagination.ts
│
└── routes/
    └── index.ts
```

---

# Layer Responsibilities

## Routes

Responsibilities:

* Define endpoints
* Attach middleware
* Call controllers

Never write business logic here.

---

## Controllers

Responsibilities:

* Receive request
* Validate request
* Call service
* Return response

Never directly access database.

---

## Services

Responsibilities:

* Business logic
* Rules
* Workflows
* Data transformations

This is the heart of the application.

---

## Repository Layer

Responsibilities:

* Database queries
* MongoDB operations
* Aggregations
* Search logic

No business logic.

---

## Models

Responsibilities:

* Schema definitions
* Indexes
* Hooks
* Virtual fields

No business logic.

---

# Authentication Strategy

Access Token

```txt
Expiry: 15 Minutes
```

Refresh Token

```txt
Expiry: 7 Days
```

Authentication Flow

```txt
Login
 ↓
Generate Access Token
 ↓
Generate Refresh Token
 ↓
Store Refresh Token
 ↓
Return Both Tokens
```

---

# Authorization Strategy

Role Based Access Control

Roles:

```txt
student
recruiter
admin
```

Example

```ts
authorize("admin")

authorize("recruiter")

authorize("student")
```

---

# Validation Strategy

Validation Library

```txt
Zod
```

Flow

```txt
Request
 ↓
Validation Middleware
 ↓
Zod Schema
 ↓
Controller
```

Benefits

* Type-safe
* Reusable schemas
* Better TypeScript support
* Cleaner request validation

---

# File Upload Strategy

Storage Provider

```txt
Cloudinary
```

Uploads Supported

```txt
Profile Picture
Resume PDF
Company Logo
```

Flow

```txt
Upload
 ↓
Multer
 ↓
Cloudinary
 ↓
Store URL in MongoDB
```

---

# Error Handling Strategy

Standard Error Format

```json
{
  "success": false,
  "message": "Internship not found",
  "errors": []
}
```

Standard Success Format

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# Logging Strategy

Log:

* Login attempts
* Failed requests
* Server errors
* Database failures

Avoid logging:

* Passwords
* Tokens
* Sensitive data

---

# Security Measures

Implemented In MVP

* JWT Authentication
* Refresh Tokens
* Password Hashing (bcrypt)
* Role-Based Authorization
* Zod Request Validation
* Rate Limiting
* Helmet Security Headers
* CORS Protection
* MongoDB Sanitization
* File Type Validation
* Secure Environment Variables

---

# Development Order

Phase 1

```txt
Auth Module
↓
User Module
↓
Student Module
↓
Company Module
↓
Recruiter Module
↓
Internship Module
↓
Application Module
↓
Interview Module
↓
Notification Module
↓
Admin Module
```

Only after these modules are stable should AI features be added.
