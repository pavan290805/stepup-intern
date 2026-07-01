# StepUpIntern Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All authenticated endpoints require either:
1. **Authorization Header**: `Authorization: Bearer {accessToken}`
2. **HTTP-only Cookies**: `accessToken` and `refreshToken`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Field error 1", "Field error 2"]
}
```

---

## Authentication Endpoints

### Register User
**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}
```

**Response**: 201 Created
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Login User
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Refresh Token
**Endpoint**: `POST /auth/refresh-token`

**Request Body** (optional - can use cookie):
```json
{
  "refreshToken": "refresh_token"
}
```

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### Logout
**Endpoint**: `POST /auth/logout`

**Auth Required**: Yes

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**Endpoint**: `GET /auth/me`

**Auth Required**: Yes

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profilePicture": "url",
    "isVerified": false,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Student Endpoints

### Create Student Profile
**Endpoint**: `POST /students/profile`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "headline": "Aspiring Software Engineer",
  "bio": "I'm passionate about web development",
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor's",
      "field": "Computer Science",
      "startDate": "2020-01-01",
      "endDate": "2024-01-01"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "linkedinUrl": "https://linkedin.com/in/user",
  "githubUrl": "https://github.com/user",
  "portfolioUrl": "https://portfolio.com"
}
```

**Response**: 201 Created

---

### Get Student Profile
**Endpoint**: `GET /students/profile`

**Auth Required**: Yes (Student only)

**Response**: 200 OK

---

### Update Student Profile
**Endpoint**: `PATCH /students/profile`

**Auth Required**: Yes (Student only)

**Request Body**: Same as create (partial update)

---

### Upload Resume
**Endpoint**: `POST /students/resume`

**Auth Required**: Yes (Student only)

**Content-Type**: multipart/form-data

**Request**:
```
Form Data:
- file: <PDF or DOC file>
```

**Response**: 201 Created
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeUrl": "https://cloudinary.url/resume.pdf"
  }
}
```

---

## Company Endpoints

### Create Company
**Endpoint**: `POST /companies`

**Auth Required**: Yes (Recruiter/Admin only)

**Request Body**:
```json
{
  "name": "Tech Corp",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "description": "Leading tech company",
  "companySize": "501-1000",
  "headquarters": "San Francisco, USA"
}
```

**Response**: 201 Created

---

### Get Companies
**Endpoint**: `GET /companies?page=1&limit=10&search=tech&verified=true`

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search company name
- `verified` (boolean): Filter verified companies

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "companies": [],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

---

### Get Company by ID
**Endpoint**: `GET /companies/:id`

**Response**: 200 OK

---

### Update Company
**Endpoint**: `PATCH /companies/:id`

**Auth Required**: Yes (Recruiter/Admin only)

**Request Body**: Partial company data

---

## Recruiter Endpoints

### Create Recruiter Profile
**Endpoint**: `POST /recruiters/profile`

**Auth Required**: Yes (Recruiter only)

**Request Body**:
```json
{
  "companyId": "company_id",
  "designation": "HR Manager",
  "phoneNumber": "+1234567890"
}
```

**Response**: 201 Created

---

### Get Recruiter Profile
**Endpoint**: `GET /recruiters/profile`

**Auth Required**: Yes (Recruiter only)

---

### Update Recruiter Profile
**Endpoint**: `PATCH /recruiters/profile`

**Auth Required**: Yes (Recruiter only)

---

## Internship Endpoints

### Create Internship
**Endpoint**: `POST /internships`

**Auth Required**: Yes (Recruiter only)

**Request Body**:
```json
{
  "title": "Frontend Developer Intern",
  "description": "We're looking for...",
  "skillsRequired": ["React", "JavaScript", "CSS"],
  "location": "Remote",
  "workMode": "remote",
  "stipend": 5000,
  "duration": "3 months",
  "openings": 5,
  "deadline": "2024-12-31T23:59:59Z"
}
```

**Response**: 201 Created

---

### Get Internships
**Endpoint**: `GET /internships?page=1&limit=10&location=remote&workMode=remote&skills=React`

**Query Parameters**:
- `page` (number)
- `limit` (number)
- `search` (string): Search in title/description
- `location` (string)
- `workMode` (string): remote/hybrid/onsite
- `skills` (array): Array of required skills
- `company` (string): Filter by company ID
- `status` (string): draft/active/closed

**Response**: 200 OK

---

### Get Internship by ID
**Endpoint**: `GET /internships/:id`

**Note**: Increments view count

---

### Update Internship
**Endpoint**: `PATCH /internships/:id`

**Auth Required**: Yes (Recruiter/Admin only)

---

### Delete Internship
**Endpoint**: `DELETE /internships/:id`

**Auth Required**: Yes (Recruiter/Admin only)

---

### Save Internship
**Endpoint**: `POST /internships/saved`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "internshipId": "internship_id"
}
```

---

### Get Saved Internships
**Endpoint**: `GET /internships/saved?page=1&limit=10`

**Auth Required**: Yes (Student only)

---

### Remove Saved Internship
**Endpoint**: `DELETE /internships/saved/:id`

**Auth Required**: Yes (Student only)

---

### Check if Internship is Saved
**Endpoint**: `GET /internships/saved/:id`

**Auth Required**: Yes (Student only)

**Response**:
```json
{
  "success": true,
  "data": {
    "isSaved": true
  }
}
```

---

## Application Endpoints

### Submit Application
**Endpoint**: `POST /applications`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "internshipId": "internship_id",
  "resumeUrl": "https://url/resume.pdf"
}
```

**Response**: 201 Created

---

### Get My Applications
**Endpoint**: `GET /applications/my?page=1&limit=10`

**Auth Required**: Yes (Student only)

---

### Get Applications for Internship
**Endpoint**: `GET /applications?internshipId=id&page=1&limit=10`

**Auth Required**: Yes (Recruiter only)

---

### Update Application Status
**Endpoint**: `PATCH /applications/:id`

**Auth Required**: Yes (Recruiter/Admin only)

**Request Body**:
```json
{
  "status": "shortlisted",
  "recruiterNotes": "Great candidate!"
}
```

**Status Values**:
- applied
- under_review
- shortlisted
- interview_scheduled
- selected
- rejected
- withdrawn

---

### Delete Application
**Endpoint**: `DELETE /applications/:id`

**Auth Required**: Yes (Student only)

---

## Interview Endpoints

### Schedule Interview
**Endpoint**: `POST /interviews`

**Auth Required**: Yes (Recruiter/Admin only)

**Request Body**:
```json
{
  "applicationId": "application_id",
  "scheduledAt": "2024-12-15T10:00:00Z",
  "mode": "online",
  "meetingLink": "https://zoom.us/meeting/..."
}
```

**Mode Values**: online, in_person, phone

**Response**: 201 Created

---

### Get Interview
**Endpoint**: `GET /interviews/:id`

**Auth Required**: Yes

---

### Update Interview
**Endpoint**: `PATCH /interviews/:id`

**Auth Required**: Yes (Recruiter/Admin only)

**Request Body**:
```json
{
  "scheduledAt": "2024-12-15T11:00:00Z",
  "mode": "online",
  "meetingLink": "https://zoom.us/...",
  "status": "completed",
  "feedback": "Good technical knowledge",
  "rating": 4
}
```

---

## Notification Endpoints

### Get Notifications
**Endpoint**: `GET /notifications?page=1&limit=10&unreadOnly=false`

**Auth Required**: Yes

**Query Parameters**:
- `page` (number)
- `limit` (number)
- `unreadOnly` (boolean): Only unread notifications

**Response**:
```json
{
  "success": true,
  "data": {
    "notifications": [],
    "unreadCount": 5,
    "pagination": {}
  }
}
```

---

### Mark Notification as Read
**Endpoint**: `PATCH /notifications/:id`

**Auth Required**: Yes

---

### Delete Notification
**Endpoint**: `DELETE /notifications/:id`

**Auth Required**: Yes

---

## Admin Endpoints

### Get All Users
**Endpoint**: `GET /admin/users?page=1&limit=10&search=john`

**Auth Required**: Yes (Admin only)

---

### Update User Status
**Endpoint**: `PATCH /admin/users/:id`

**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "isActive": true
}
```

---

### Delete User
**Endpoint**: `DELETE /admin/users/:id`

**Auth Required**: Yes (Admin only)

---

### Get Pending Recruiters
**Endpoint**: `GET /admin/recruiters?page=1&limit=10`

**Auth Required**: Yes (Admin only)

---

### Verify/Reject Recruiter
**Endpoint**: `PATCH /admin/recruiters/:id`

**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "action": "verify"
}
```

**Action Values**: verify, reject

---

### Get Pending Companies
**Endpoint**: `GET /admin/companies?page=1&limit=10`

**Auth Required**: Yes (Admin only)

---

### Verify/Reject Company
**Endpoint**: `PATCH /admin/companies/:id`

**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "action": "verify"
}
```

---

### Get All Internships
**Endpoint**: `GET /admin/internships?page=1&limit=10`

**Auth Required**: Yes (Admin only)

---

### Update Internship Status
**Endpoint**: `PATCH /admin/internships/:id`

**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "status": "active"
}
```

---

### Delete Internship
**Endpoint**: `DELETE /admin/internships/:id`

**Auth Required**: Yes (Admin only)

---

### Get Platform Statistics
**Endpoint**: `GET /admin/statistics`

**Auth Required**: Yes (Admin only)

**Response**:
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalUsers": 1000,
      "totalCompanies": 50,
      "totalInternships": 200,
      "totalApplications": 5000,
      "studentCount": 800,
      "recruiterCount": 200
    }
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 403 | Forbidden / Insufficient Permissions |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS

Configured for frontend domain. Update `CORS_ORIGIN` in environment for production.

---

## Pagination

All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```
