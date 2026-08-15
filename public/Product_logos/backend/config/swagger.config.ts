import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "StepUp for AI Backend API",
      version: "2.0.0",
      description: `Production-ready backend implementing Phases 1–8 including:

- **Authentication** — Registration, login, session management, 2FA, email verification, password reset
- **Students** — Profile, resume upload/management, internship discovery, applications, saved internships, AI resume analysis, analytics, dashboard
- **Recruiters** — Profile, company management, internship lifecycle (create/publish/close), applicant management, interviews, AI JD generation, analytics
- **AI** — Resume analyzer (students), Job Description generator (recruiters)
- **Payments** — Plans, checkout (Razorpay), subscriptions, payment history, invoices, webhook
- **Events** — Event discovery, registration, lifecycle management (publish/cancel/archive), attendance
- **Community** — Posts, comments, replies, likes, bookmarks, moderation
- **Investors** — Profile, startup discovery, deal pipeline, saved startups, messaging, analytics
- **Mentors** — Profile, session requests, session lifecycle (confirm/cancel/complete), reviews, points/rewards
- **Administration** — User management (list/approve/ban/role), bulk actions, analytics, audit logs, content moderation, reports, CSV export`,
      contact: {
        name: "StepUp for AI Team",
      },
    },
    servers: [
      { url: "/api/v1", description: "API v1" },
    ],
    tags: [
      { name: "Authentication", description: "User registration, login, sessions, 2FA, and password management" },
      { name: "Students", description: "Student profile, resume, internship discovery, and applications" },
      { name: "Recruiters", description: "Recruiter profile, company, internships, applicants, and interviews" },
      { name: "AI", description: "AI-powered resume analysis and job description generation" },
      { name: "Payments", description: "Subscription plans, checkout, payment history, and invoices" },
      { name: "Events", description: "Event discovery, registration, and lifecycle management" },
      { name: "Community", description: "Community posts, comments, likes, and bookmarks" },
      { name: "Investors", description: "Investor profile, startup discovery, deal pipeline, and messaging" },
      { name: "Mentors", description: "Mentor profile, session management, and rewards" },
      { name: "Messaging", description: "Direct messaging between users" },
      { name: "Administration", description: "Admin user management, analytics, audit logs, and content moderation" },
      { name: "Health", description: "Service health check" },
      { name: "Documentation", description: "OpenAPI specification endpoint" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "stepup_session",
          description: "Session cookie set automatically on login. Send along with all authenticated requests.",
        },
      },
      schemas: {
        // ─── Generic wrappers ────────────────────────────────────────────────
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object", description: "Response payload (shape varies by endpoint)" },
            message: { type: "string", example: "Operation completed successfully" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Invalid request payload" },
                details: { type: "object", description: "Structured validation error details" },
              },
            },
          },
        },
        PaginatedResult: {
          type: "object",
          properties: {
            items: { type: "array", items: { type: "object" } },
            nextCursor: { type: "string", nullable: true, description: "Cursor for the next page; null when last page reached" },
            total: { type: "integer", description: "Total count (when available)" },
          },
        },
        // ─── Auth / User ──────────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6650f0a1b2c3d4e5f6a7b8c9" },
            email: { type: "string", format: "email", example: "user@example.com" },
            role: {
              type: "string",
              enum: ["student", "recruiter", "investor", "mentor", "admin", "super_admin"],
            },
            status: {
              type: "string",
              enum: ["pending", "active", "suspended", "banned"],
            },
            isEmailVerified: { type: "boolean" },
            twoFactorEnabled: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RegisterBody: {
          type: "object",
          required: ["email", "password", "confirmPassword", "role"],
          properties: {
            email: { type: "string", format: "email", example: "student@example.com" },
            password: { type: "string", minLength: 8, example: "SecurePass123!" },
            confirmPassword: { type: "string", example: "SecurePass123!" },
            role: {
              type: "string",
              enum: ["student", "recruiter", "investor", "mentor"],
            },
          },
        },
        LoginBody: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", example: "SecurePass123!" },
            twoFactorCode: { type: "string", pattern: "^\\d{6}$", example: "123456" },
          },
        },
        ConfirmTwoFactorBody: {
          type: "object",
          required: ["secret", "code"],
          properties: {
            secret: { type: "string", description: "TOTP secret returned by GET /auth/2fa" },
            code: { type: "string", pattern: "^\\d{6}$", example: "123456" },
          },
        },
        // ─── Student ──────────────────────────────────────────────────────────
        StudentProfile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fullName: { type: "string", example: "Alice Johnson" },
            headline: { type: "string", example: "Full-Stack Developer" },
            bio: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            education: {
              type: "array",
              items: { $ref: "#/components/schemas/EducationEntry" },
            },
            experience: {
              type: "array",
              items: { $ref: "#/components/schemas/ExperienceEntry" },
            },
            githubUrl: { type: "string", format: "uri" },
            linkedinUrl: { type: "string", format: "uri" },
            portfolioUrl: { type: "string", format: "uri" },
            activeResumeId: { type: "string", nullable: true },
          },
        },
        EducationEntry: {
          type: "object",
          required: ["institution", "degree", "startYear"],
          properties: {
            institution: { type: "string", example: "MIT" },
            degree: { type: "string", example: "B.Sc. Computer Science" },
            fieldOfStudy: { type: "string" },
            startYear: { type: "integer", example: 2020 },
            endYear: { type: "integer", example: 2024 },
          },
        },
        ExperienceEntry: {
          type: "object",
          required: ["title", "organization", "startDate"],
          properties: {
            title: { type: "string", example: "Software Intern" },
            organization: { type: "string", example: "Acme Corp" },
            description: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
            isCurrent: { type: "boolean", default: false },
          },
        },
        UpsertStudentProfileBody: {
          type: "object",
          required: ["fullName"],
          properties: {
            fullName: { type: "string", minLength: 2, maxLength: 120 },
            headline: { type: "string", maxLength: 150 },
            bio: { type: "string", maxLength: 2000 },
            skills: { type: "array", items: { type: "string" }, maxItems: 50 },
            education: { type: "array", items: { $ref: "#/components/schemas/EducationEntry" } },
            experience: { type: "array", items: { $ref: "#/components/schemas/ExperienceEntry" } },
            githubUrl: { type: "string", format: "uri" },
            linkedinUrl: { type: "string", format: "uri" },
            portfolioUrl: { type: "string", format: "uri" },
          },
        },
        Resume: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fileName: { type: "string", example: "resume-alice.pdf" },
            mimeType: { type: "string", example: "application/pdf" },
            sizeBytes: { type: "integer" },
            url: { type: "string", format: "uri" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Recruiter ────────────────────────────────────────────────────────
        RecruiterProfile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fullName: { type: "string" },
            designation: { type: "string" },
            companyId: { type: "string", nullable: true },
          },
        },
        UpsertRecruiterProfileBody: {
          type: "object",
          required: ["fullName"],
          properties: {
            fullName: { type: "string", minLength: 2, maxLength: 120 },
            designation: { type: "string", maxLength: 120 },
          },
        },
        Company: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "Acme Corp" },
            website: { type: "string", format: "uri" },
            industry: { type: "string" },
            size: {
              type: "string",
              enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
            },
            description: { type: "string" },
            logoUrl: { type: "string", format: "uri", nullable: true },
            ownerId: { type: "string" },
          },
        },
        CreateCompanyBody: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 2, maxLength: 150 },
            website: { type: "string", format: "uri" },
            industry: { type: "string", maxLength: 100 },
            size: {
              type: "string",
              enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
            },
            description: { type: "string", maxLength: 5000 },
          },
        },
        // ─── Internship ───────────────────────────────────────────────────────
        Internship: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            companyId: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            type: { type: "string", enum: ["remote", "onsite", "hybrid"] },
            stipend: { type: "number" },
            duration: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            status: {
              type: "string",
              enum: ["draft", "published", "closed", "archived"],
            },
            applicationDeadline: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Application ──────────────────────────────────────────────────────
        Application: {
          type: "object",
          properties: {
            _id: { type: "string" },
            internshipId: { type: "string" },
            studentId: { type: "string" },
            resumeId: { type: "string" },
            coverNote: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "reviewed", "shortlisted", "rejected", "hired", "withdrawn"],
            },
            appliedAt: { type: "string", format: "date-time" },
          },
        },
        CreateApplicationBody: {
          type: "object",
          required: ["internshipId", "resumeId"],
          properties: {
            internshipId: { type: "string", example: "6650f0a1b2c3d4e5f6a7b8c9" },
            resumeId: { type: "string", example: "6650f0a1b2c3d4e5f6a7b8ca" },
            coverNote: { type: "string", maxLength: 2000 },
          },
        },
        // ─── Interview ────────────────────────────────────────────────────────
        Interview: {
          type: "object",
          properties: {
            _id: { type: "string" },
            applicationId: { type: "string" },
            scheduledAt: { type: "string", format: "date-time" },
            mode: { type: "string", enum: ["video", "phone", "onsite"] },
            meetingLink: { type: "string", format: "uri", nullable: true },
            location: { type: "string", nullable: true },
            notes: { type: "string", nullable: true },
          },
        },
        ScheduleInterviewBody: {
          type: "object",
          required: ["applicationId", "scheduledAt", "mode"],
          properties: {
            applicationId: { type: "string" },
            scheduledAt: { type: "string", format: "date-time" },
            mode: { type: "string", enum: ["video", "phone", "onsite"] },
            meetingLink: { type: "string", format: "uri" },
            location: { type: "string", maxLength: 300 },
            notes: { type: "string", maxLength: 1000 },
          },
        },
        // ─── Payment / Plan / Subscription ───────────────────────────────────
        Plan: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "Pro" },
            price: { type: "number", example: 999 },
            currency: { type: "string", example: "INR" },
            interval: { type: "string", enum: ["monthly", "yearly"] },
            features: { type: "array", items: { type: "string" } },
            isActive: { type: "boolean" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            planId: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            status: { type: "string", enum: ["created", "paid", "failed", "refunded"] },
            razorpayOrderId: { type: "string" },
            razorpayPaymentId: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Subscription: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            planId: { type: "string" },
            status: { type: "string", enum: ["active", "cancelled", "expired", "past_due"] },
            currentPeriodStart: { type: "string", format: "date-time" },
            currentPeriodEnd: { type: "string", format: "date-time" },
            cancelledAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        CheckoutBody: {
          type: "object",
          required: ["planId"],
          properties: {
            planId: { type: "string", example: "6650f0a1b2c3d4e5f6a7b8c9" },
          },
        },
        Invoice: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            paymentId: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            status: { type: "string", enum: ["draft", "issued", "paid", "void"] },
            issuedAt: { type: "string", format: "date-time" },
            pdfUrl: { type: "string", format: "uri", nullable: true },
          },
        },
        // ─── Event ────────────────────────────────────────────────────────────
        Event: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            organizerId: { type: "string" },
            startAt: { type: "string", format: "date-time" },
            endAt: { type: "string", format: "date-time" },
            location: { type: "string" },
            isVirtual: { type: "boolean" },
            meetingLink: { type: "string", format: "uri", nullable: true },
            maxAttendees: { type: "integer", nullable: true },
            status: {
              type: "string",
              enum: ["draft", "published", "cancelled", "archived"],
            },
            tags: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Registration: {
          type: "object",
          properties: {
            _id: { type: "string" },
            eventId: { type: "string" },
            userId: { type: "string" },
            attended: { type: "boolean" },
            registeredAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Community ────────────────────────────────────────────────────────
        CommunityPost: {
          type: "object",
          properties: {
            _id: { type: "string" },
            authorId: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            category: { type: "string", nullable: true },
            tags: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["published", "hidden", "removed"] },
            likeCount: { type: "integer" },
            commentCount: { type: "integer" },
            bookmarkCount: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreatePostBody: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", minLength: 3, maxLength: 200 },
            content: { type: "string", minLength: 10, maxLength: 20000 },
            category: { type: "string", maxLength: 100 },
            tags: { type: "array", items: { type: "string" }, maxItems: 20 },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            postId: { type: "string" },
            authorId: { type: "string" },
            content: { type: "string" },
            parentCommentId: { type: "string", nullable: true },
            likeCount: { type: "integer" },
            replyCount: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateCommentBody: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", minLength: 1, maxLength: 5000 },
            parentCommentId: { type: "string", description: "Provide to create a threaded reply" },
          },
        },
        // ─── Investor ─────────────────────────────────────────────────────────
        InvestorProfile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fullName: { type: "string" },
            bio: { type: "string" },
            investmentFocus: { type: "array", items: { type: "string" } },
            ticketSize: { type: "string" },
            linkedinUrl: { type: "string", format: "uri" },
          },
        },
        Startup: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            tagline: { type: "string" },
            description: { type: "string" },
            industry: { type: "string" },
            stage: { type: "string", enum: ["idea", "pre-seed", "seed", "series-a", "series-b", "growth"] },
            location: { type: "string" },
            website: { type: "string", format: "uri" },
            foundedYear: { type: "integer" },
            teamSize: { type: "integer" },
            ownerId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Deal: {
          type: "object",
          properties: {
            _id: { type: "string" },
            investorId: { type: "string" },
            startupId: { type: "string" },
            stage: {
              type: "string",
              enum: ["prospect", "initial-contact", "due-diligence", "term-sheet", "closed", "rejected"],
            },
            notes: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Mentor ───────────────────────────────────────────────────────────
        MentorProfile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fullName: { type: "string" },
            bio: { type: "string" },
            expertise: { type: "array", items: { type: "string" } },
            yearsOfExperience: { type: "integer" },
            linkedinUrl: { type: "string", format: "uri" },
            availability: { type: "string" },
            pointsBalance: { type: "integer" },
          },
        },
        MentorSession: {
          type: "object",
          properties: {
            _id: { type: "string" },
            mentorId: { type: "string" },
            studentId: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            scheduledAt: { type: "string", format: "date-time" },
            topic: { type: "string" },
            notes: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5, nullable: true },
            review: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Admin / AuditLog ─────────────────────────────────────────────────
        AuditLog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            actorId: { type: "string" },
            action: { type: "string" },
            targetType: { type: "string" },
            targetId: { type: "string" },
            metadata: { type: "object" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Messaging ────────────────────────────────────────────────────────
        Message: {
          type: "object",
          properties: {
            _id: { type: "string" },
            senderId: { type: "string" },
            receiverId: { type: "string" },
            content: { type: "string" },
            readAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        SendMessageBody: {
          type: "object",
          required: ["receiverId", "content"],
          properties: {
            receiverId: { type: "string" },
            content: { type: "string", minLength: 1, maxLength: 5000 },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Not authenticated — valid session cookie required",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
              example: { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
            },
          },
        },
        Forbidden: {
          description: "Authenticated but insufficient role/permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
              example: { success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
              example: { success: false, error: { code: "NOT_FOUND", message: "Resource not found" } },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
              example: {
                success: false,
                error: { code: "VALIDATION_ERROR", message: "Invalid request payload", details: {} },
              },
            },
          },
        },
        Conflict: {
          description: "Resource conflict (e.g. duplicate email)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
        TooManyRequests: {
          description: "Rate limit exceeded",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
              example: { success: false, error: { code: "RATE_LIMITED", message: "Too many requests, please retry later" } },
            },
          },
        },
        InternalError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
      },
      parameters: {
        IdPath: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "MongoDB ObjectId of the target resource",
        },
        UserIdPath: {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "MongoDB ObjectId of the target user",
        },
        CursorQuery: {
          name: "cursor",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Opaque pagination cursor returned by previous page",
        },
        LimitQuery: {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          description: "Number of items per page",
        },
        SearchQuery: {
          name: "q",
          in: "query",
          required: false,
          schema: { type: "string", maxLength: 200 },
          description: "Full-text search query string",
        },
        RoleFilter: {
          name: "role",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["student", "recruiter", "investor", "mentor", "admin", "super_admin"],
          },
          description: "Filter by user role",
        },
        StatusFilter: {
          name: "status",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Filter by resource status",
        },
        SinceDaysQuery: {
          name: "sinceDays",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, maximum: 365, default: 30 },
          description: "Look-back window in days for reporting endpoints",
        },
      },
      requestBodies: {
        RegisterBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterBody" },
            },
          },
        },
        LoginBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginBody" },
            },
          },
        },
        ResumeUpload: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "PDF or DOCX resume file",
                  },
                },
              },
            },
          },
        },
        CreatePostBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostBody" },
            },
          },
        },
        CreateCommentBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentBody" },
            },
          },
        },
        CreateApplicationBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateApplicationBody" },
            },
          },
        },
        CheckoutBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CheckoutBody" },
            },
          },
        },
        SendMessageBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SendMessageBody" },
            },
          },
        },
      },
    },
  },
  apis: ["./app/api/v1/**/route.ts"],
};

export const openApiSpec = swaggerJsdoc(options);
