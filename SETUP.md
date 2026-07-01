# Backend Setup Guide

## Prerequisites

- Node.js 16+ (preferably 18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- Mongoose (MongoDB ORM)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- zod (validation)
- cloudinary (file uploads)

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the following variables:

#### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stepup-intern?retryWrites=true&w=majority
```

Get your MongoDB connection string from:
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create/select your cluster
3. Click "Connect"
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>` with your credentials

#### JWT Configuration
```
JWT_SECRET=your_long_random_secret_key_here_make_it_secure
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here_make_it_secure
JWT_REFRESH_EXPIRE=7d
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Cloudinary Setup
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these from:
1. Go to Cloudinary (https://cloudinary.com)
2. Sign up or login
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

#### Application
```
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### 4. Test the Backend

#### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "student"
  }'
```

#### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Test Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
src/
├── lib/
│   ├── db.ts              # MongoDB connection
│   ├── auth.ts            # JWT utilities
│   ├── cloudinary.ts      # File upload
│   └── validations/       # Zod schemas
├── models/                # Mongoose schemas
├── modules/               # Feature modules
│   ├── auth/
│   ├── student/
│   ├── company/
│   ├── recruiter/
│   ├── internship/
│   ├── application/
│   ├── interview/
│   ├── notification/
│   └── admin/
├── middleware/            # Custom middleware
├── types/                 # TypeScript types
├── constants/             # App constants
└── utils/                 # Helper functions

app/api/                   # Next.js API routes
├── auth/
├── students/
├── companies/
├── recruiters/
├── internships/
├── applications/
├── interviews/
├── notifications/
└── admin/
```

## Database Setup

### Create Collections with Indexes

Indexes are automatically created by Mongoose based on the model definitions. Key indexes include:

- **User**: email (unique), role
- **StudentProfile**: userId (unique)
- **RecruiterProfile**: userId (unique), companyId
- **Internship**: companyId, recruiterId, status, workMode, location, skillsRequired
- **Application**: internshipId + studentId (unique), studentId, status
- **Interview**: applicationId (unique), status
- **SavedInternship**: studentId + internshipId (unique), studentId
- **Notification**: userId, isRead, createdAt

## API Testing

### Using Postman

1. Import the API collection (create one from scratch)
2. Set up environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (will be set after login)
   - `refreshToken`: (will be set after login)

3. Test endpoints in order:
   - Register → Login → Create Profile → Create Company → Create Internship

### Using curl

Examples provided in API_DOCUMENTATION.md

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create requests for each endpoint
3. Save collections for later use

## Common Issues & Solutions

### MongoDB Connection Error
- Check MONGODB_URI in .env.local
- Ensure MongoDB Atlas cluster is active
- Verify IP whitelist includes your IP (or use 0.0.0.0 for development)

### JWT Token Issues
- Ensure JWT_SECRET and JWT_REFRESH_SECRET are properly set
- Check token expiration time
- Verify token format in Authorization header: `Bearer <token>`

### Cloudinary Upload Errors
- Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
- Check file size (max 5MB by default)
- Ensure file types are supported (PDF, DOC, JPG, PNG, WebP)

### CORS Errors
- Verify frontend URL in CORS configuration
- Check request headers include proper Content-Type
- Ensure cookies are enabled in browser

## Development Best Practices

### Code Organization
1. Keep models focused and simple
2. Move business logic to services
3. Keep route handlers thin and focused
4. Use middleware for cross-cutting concerns

### Error Handling
- Always use try-catch in route handlers
- Return appropriate HTTP status codes
- Include descriptive error messages
- Log errors for debugging

### Validation
- Validate all request inputs using Zod
- Validate query parameters
- Validate file uploads
- Provide clear validation error messages

### Security
- Never store passwords in plain text (use bcrypt)
- Use HTTPS in production
- Implement rate limiting
- Use environment variables for secrets
- Validate and sanitize user inputs
- Use HTTP-only cookies for tokens

## Deployment Checklist

- [ ] Update MONGODB_URI to production database
- [ ] Generate strong JWT secrets
- [ ] Set NODE_ENV to production
- [ ] Update NEXT_PUBLIC_API_URL
- [ ] Configure CORS for production domain
- [ ] Set up proper error logging
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Review security headers
- [ ] Test all endpoints on production

## Performance Optimization

1. **Database Indexing**: Ensure all frequently queried fields have indexes
2. **Query Optimization**: Use lean() for read-only queries
3. **Pagination**: Implement on all list endpoints
4. **Caching**: Consider Redis for session/notification caching
5. **File Compression**: Enable gzip compression
6. **Database Connection Pooling**: Already configured via Mongoose

## Monitoring & Logging

Consider adding:
- Morgan for request logging
- Winston for application logging
- Sentry for error tracking
- New Relic for performance monitoring

## Next Steps

1. Set up frontend (React/Next.js)
2. Implement WebSocket for real-time notifications
3. Add email notifications
4. Implement interview recording
5. Add platform analytics
6. Create admin dashboard
