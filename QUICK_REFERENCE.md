# Quick Reference - Backend API

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Start dev server
npm run dev

# API runs at: http://localhost:3000/api
```

---

## 🔑 User Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Student** | Apply, Save internships, Upload resume, View profile | Create internships, Verify companies, View admin panel |
| **Recruiter** | Create internships, Manage applications, Schedule interviews | Access admin panel, Manage other companies |
| **Admin** | Verify companies, Manage recruiters, View statistics, Moderate content | Apply for internships, Create company profiles |

---

## 🔐 Authentication Flow

### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@example.com","password":"Pass123","role":"student"}'
```
Returns: `accessToken`, `refreshToken`

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123"}'
```
Returns: `accessToken`, `refreshToken`

### 3. Use Access Token
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

### 4. Refresh Token (if expired)
```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"{refreshToken}"}'
```

### 5. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer {accessToken}"
```

---

## 📋 Common Endpoints

### Students
```
POST   /api/students/profile           # Create profile
GET    /api/students/profile           # Get profile
PATCH  /api/students/profile           # Update profile
POST   /api/students/resume            # Upload resume
```

### Internships
```
POST   /api/internships                # Create (Recruiter)
GET    /api/internships                # List all
GET    /api/internships/:id            # Get one
PATCH  /api/internships/:id            # Update (Recruiter)
DELETE /api/internships/:id            # Delete (Recruiter)
```

### Saved Internships
```
POST   /api/internships/saved          # Save internship
GET    /api/internships/saved          # Get saved list
DELETE /api/internships/saved/:id      # Remove saved
GET    /api/internships/saved/:id      # Check if saved
```

### Applications
```
POST   /api/applications               # Apply for internship
GET    /api/applications/my            # Get my applications
PATCH  /api/applications/:id           # Update status (Recruiter)
DELETE /api/applications/:id           # Delete (Student)
```

### Notifications
```
GET    /api/notifications              # Get notifications
PATCH  /api/notifications/:id/read     # Mark as read
DELETE /api/notifications/:id          # Delete
```

---

## 🔍 Query Parameters

### Pagination
```
?page=1&limit=10
```

### Internship Filtering
```
?page=1
&limit=10
&location=remote
&workMode=remote
&skills=React,JavaScript
&search=frontend
```

### Notifications
```
?page=1&limit=10&unreadOnly=true
```

---

## 📤 File Upload

### Resume Upload (Student)
```bash
curl -X POST http://localhost:3000/api/students/resume \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/resume.pdf"
```

Supported formats: PDF, DOC, DOCX
Max size: 5MB

---

## ✅ Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* data */ }
}
```

### Error (4xx/5xx)
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Field error 1", "Field error 2"]
}
```

---

## 📊 Common Status Values

### Internship Status
- `draft` - Not published
- `active` - Currently open
- `closed` - Applications closed

### Application Status
- `applied` - Just submitted
- `under_review` - Being reviewed
- `shortlisted` - Shortlisted
- `interview_scheduled` - Interview confirmed
- `selected` - Job offered
- `rejected` - Not selected
- `withdrawn` - Candidate withdrew

### Interview Status
- `scheduled` - Upcoming
- `completed` - Finished
- `cancelled` - Cancelled

### Verification Status
- `pending` - Awaiting admin review
- `verified` - Approved
- `rejected` - Rejected

---

## 🐛 Common Errors

| Status | Cause | Solution |
|--------|-------|----------|
| 400 | Bad request | Check request format, validation |
| 401 | Unauthorized | Add Authorization header with token |
| 403 | Forbidden | Check role, insufficient permissions |
| 404 | Not found | Check if resource exists |
| 409 | Conflict | Duplicate email, already saved, etc. |
| 500 | Server error | Check server logs |

---

## 🧪 Testing Endpoints

### All Tests
```bash
# See TESTING.md for complete guide
```

### Quick Test (Register → Login → Get Profile)
```bash
# 1. Register
TOKEN=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Pass123","role":"student"}' \
  | jq -r '.data.accessToken')

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'

# 3. Get Profile
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Environment Variables

```
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# JWT
JWT_SECRET=<random-secure-string>
JWT_REFRESH_SECRET=<random-secure-string>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📚 Documentation

- Full API docs: See `API_DOCUMENTATION.md`
- Setup guide: See `SETUP.md`
- Testing guide: See `TESTING.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Development Workflow

1. **Start Server**
   ```bash
   npm run dev
   ```

2. **Test Endpoint**
   ```bash
   curl -X GET http://localhost:3000/api/internships \
     -H "Authorization: Bearer {token}"
   ```

3. **Check Logs**
   - Monitor console for errors
   - Check MongoDB connection
   - Verify environment variables

4. **Use TypeScript**
   - Import types from `@/types`
   - Use services from modules
   - Validate with Zod schemas

---

## 💡 Pro Tips

1. **Save Bearer Token**
   ```bash
   TOKEN="your_token_here"
   curl -H "Authorization: Bearer $TOKEN" ...
   ```

2. **Pretty Print JSON**
   ```bash
   curl ... | jq .
   ```

3. **Save to Variable**
   ```bash
   ID=$(curl ... | jq -r '.data.id')
   ```

4. **Use Postman**
   - Import API collection
   - Set environment variables
   - Test all endpoints graphically

5. **Check Types**
   ```bash
   grep -r "interface I" src/models/
   ```

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Check: MONGODB_URI in .env.local
Verify: MongoDB Atlas cluster is active
Allow: Your IP in network access
```

### Token Expired
```
Use refresh token to get new access token
POST /auth/refresh-token
```

### File Upload Failed
```
Check: File size < 5MB
Check: File type is supported
Add: file= in form data
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

---

## 📞 Quick Links

- GitHub: [Link to repo]
- Docs: See project README.md
- Issues: Create GitHub issue
- API Status: http://localhost:3000/api/health (if available)

---

**Last Updated**: 2024
**Status**: Ready for development ✅
