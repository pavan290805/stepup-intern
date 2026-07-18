# Entities & Relationships (MVP Phase 1)

## 1. User Entity

### Purpose

Acts as the central authentication and authorization entity for all platform users.

### Fields

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: "student" | "recruiter" | "admin",

  isEmailVerified: Boolean,
  isActive: Boolean,

  profilePicture: String,

  refreshToken: String,

  lastLogin: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```txt
User (1:1) StudentProfile
User (1:1) RecruiterProfile
User (1:N) Notifications
```

### Indexes

```js
email: unique
role: index
```

---

# 2. Student Profile Entity

### Purpose

Stores all career-related student information.

### Fields

```js
{
  _id: ObjectId,

  userId: ObjectId,

  headline: String,
  bio: String,

  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  experience: [],

  resumeUrl: String,

  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,

  profileCompletion: Number,

  visibility: Boolean,

  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```txt
StudentProfile (1:N) Applications
StudentProfile (1:N) SavedInternships
```

### Indexes

```js
userId: unique
skills: index
```

---

# 3. Company Entity

### Purpose

Represents an organization that recruits candidates.

### Fields

```js
{
  _id: ObjectId,

  name: String,
  industry: String,

  website: String,

  logoUrl: String,

  description: String,

  companySize: String,

  headquarters: String,

  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  },

  verificationStatus:
    "pending" |
    "approved" |
    "rejected",

  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```txt
Company (1:N) Recruiters
Company (1:N) Internships
```

### Indexes

```js
name
industry
verificationStatus
```

---

# 4. Recruiter Profile Entity

### Purpose

Stores recruiter-specific information.

### Fields

```js
{
  _id: ObjectId,

  userId: ObjectId,

  companyId: ObjectId,

  designation: String,

  phoneNumber: String,

  verificationStatus:
    "pending" |
    "approved" |
    "rejected",

  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```txt
RecruiterProfile (N:1) Company
RecruiterProfile (1:N) Internships
```

### Indexes

```js
userId
companyId
```

---

# 5. Internship Entity

### Purpose

Represents internship opportunities.

### Fields

```js
{
  _id: ObjectId,

  recruiterId: ObjectId,

  companyId: ObjectId,

  title: String,

  description: String,

  skillsRequired: [String],

  location: String,

  workMode:
    "remote" |
    "hybrid" |
    "onsite",

  stipend: Number,

  duration: String,

  openings: Number,

  deadline: Date,

  featured: Boolean,

  status:
    "draft" |
    "active" |
    "closed",

  views: Number,

  applicationsCount: Number,

  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```txt
Internship (1:N) Applications
Internship (N:1) Company
Internship (N:1) Recruiter
```

### Indexes

```js
title
skillsRequired
location
status
deadline
```

---

# 6. Application Entity

### Purpose

Tracks internship applications.

### Fields

```js
{
  _id: ObjectId,

  internshipId: ObjectId,

  studentId: ObjectId,

  resumeUrl: String,

  status:
    "applied" |
    "under_review" |
    "shortlisted" |
    "interview_scheduled" |
    "selected" |
    "rejected" |
    "withdrawn",

  recruiterNotes: String,

  appliedAt: Date
}
```

### Relationships

```txt
Application (N:1) StudentProfile
Application (N:1) Internship
Application (1:1) Interview
```

### Indexes

```js
studentId
internshipId
status
```

---

# 7. Interview Entity

### Purpose

Interview scheduling and tracking.

### Fields

```js
{
  _id: ObjectId,

  applicationId: ObjectId,

  scheduledAt: Date,

  mode:
    "online" |
    "offline",

  meetingLink: String,

  status:
    "pending" |
    "confirmed" |
    "completed" |
    "cancelled" |
    "rescheduled",

  feedback: String,

  rating: Number,

  createdAt: Date
}
```

### Relationships

```txt
Interview (1:1) Application
```

---

# 8. Saved Internship Entity

### Purpose

Stores bookmarked internships.

### Fields

```js
{
  _id: ObjectId,

  studentId: ObjectId,

  internshipId: ObjectId,

  savedAt: Date
}
```

### Relationships

```txt
StudentProfile (1:N) SavedInternships
Internship (1:N) SavedInternships
```

### Unique Constraint

```js
studentId + internshipId
```

---

# 9. Notification Entity

### Purpose

Stores system notifications.

### Fields

```js
{
  _id: ObjectId,

  userId: ObjectId,

  title: String,

  message: String,

  type:
    "application" |
    "interview" |
    "system",

  isRead: Boolean,

  createdAt: Date
}
```

### Relationships

```txt
User (1:N) Notifications
```

### Indexes

```js
userId
isRead
createdAt
```

---

# Database Relationships Summary

```txt
User
├── StudentProfile
├── RecruiterProfile
└── Notifications

Company
├── Recruiters
└── Internships

Recruiter
└── Internships

Student
├── Applications
└── SavedInternships

Internship
├── Applications
└── SavedInternships

Application
└── Interview
```
