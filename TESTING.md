# Testing Guide for StepUpIntern Backend

## Manual Testing with curl

### 1. User Authentication

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Student",
    "email": "alice@example.com",
    "password": "SecurePass123",
    "role": "student"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

Save the accessToken from response.

#### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### 2. Student Profile

#### Create Profile
```bash
curl -X POST http://localhost:3000/api/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Computer Science Student",
    "bio": "Passionate about web development",
    "skills": ["JavaScript", "React", "Node.js"],
    "education": [
      {
        "school": "XYZ University",
        "degree": "Bachelor",
        "field": "Computer Science",
        "startDate": "2020-09-01",
        "endDate": "2024-05-31"
      }
    ]
  }'
```

#### Get Profile
```bash
curl -X GET http://localhost:3000/api/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Company & Recruiter (Recruiter Flow)

#### Register Recruiter
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Recruiter",
    "email": "bob@techcorp.com",
    "password": "SecurePass123",
    "role": "recruiter"
  }'
```

#### Create Company
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Corp",
    "industry": "Software",
    "website": "https://techcorp.com",
    "description": "Leading software development company",
    "companySize": "201-500",
    "headquarters": "San Francisco, USA"
  }'
```

#### Get Companies
```bash
curl -X GET "http://localhost:3000/api/companies?page=1&limit=10" \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

#### Create Recruiter Profile
```bash
curl -X POST http://localhost:3000/api/recruiters/profile \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "COMPANY_ID_FROM_PREVIOUS_RESPONSE",
    "designation": "HR Manager",
    "phoneNumber": "+1234567890"
  }'
```

### 4. Internship Management

#### Create Internship
```bash
curl -X POST http://localhost:3000/api/internships \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend Developer Intern",
    "description": "We are looking for a talented frontend developer to join our team",
    "skillsRequired": ["React", "JavaScript", "CSS"],
    "location": "San Francisco, CA",
    "workMode": "hybrid",
    "stipend": 5000,
    "duration": "3 months",
    "openings": 3,
    "deadline": "2024-12-31T23:59:59Z"
  }'
```

#### Get All Internships
```bash
curl -X GET "http://localhost:3000/api/internships?page=1&limit=10&workMode=remote" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Get Internship Details
```bash
curl -X GET http://localhost:3000/api/internships/INTERNSHIP_ID \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Update Internship
```bash
curl -X PATCH http://localhost:3000/api/internships/INTERNSHIP_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'
```

### 5. Internship Applications

#### Save Internship
```bash
curl -X POST http://localhost:3000/api/internships/saved \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "internshipId": "INTERNSHIP_ID"
  }'
```

#### Get Saved Internships
```bash
curl -X GET "http://localhost:3000/api/internships/saved?page=1&limit=10" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Apply for Internship
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "internshipId": "INTERNSHIP_ID",
    "resumeUrl": "https://cloudinary.url/resume.pdf"
  }'
```

#### Get My Applications
```bash
curl -X GET "http://localhost:3000/api/applications/my?page=1&limit=10" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Get Applications (Recruiter)
```bash
curl -X GET "http://localhost:3000/api/applications?page=1&limit=10" \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

#### Update Application Status
```bash
curl -X PATCH http://localhost:3000/api/applications/APPLICATION_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "recruiterNotes": "Great candidate! Let\''s schedule an interview."
  }'
```

### 6. Interviews

#### Schedule Interview
```bash
curl -X POST http://localhost:3000/api/interviews \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "APPLICATION_ID",
    "scheduledAt": "2024-12-15T10:00:00Z",
    "mode": "online",
    "meetingLink": "https://zoom.us/j/123456789"
  }'
```

### 7. Notifications

#### Get Notifications
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1&limit=10&unreadOnly=true" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Mark as Read
```bash
curl -X PATCH http://localhost:3000/api/notifications/NOTIFICATION_ID \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### 8. Admin Operations

#### Register Admin (for testing only)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePass123",
    "role": "admin"
  }'
```

#### Get All Users
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Get Platform Statistics
```bash
curl -X GET http://localhost:3000/api/admin/statistics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Verify Company
```bash
curl -X PATCH http://localhost:3000/api/admin/companies/COMPANY_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify"
  }'
```

## Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can refresh token
- [ ] User can logout
- [ ] Student can create profile
- [ ] Recruiter can create company
- [ ] Recruiter can create internship
- [ ] Student can view internships
- [ ] Student can apply for internship
- [ ] Student can save internship
- [ ] Recruiter can update application status
- [ ] Recruiter can schedule interview
- [ ] Student can view notifications
- [ ] Admin can verify company
- [ ] Admin can view statistics

## Automated Testing

To add automated tests, use:
- Jest for unit tests
- Supertest for API testing

Example:
```bash
npm install --save-dev jest supertest @types/jest
```

Create test files in `__tests__` directory and run:
```bash
npm test
```
