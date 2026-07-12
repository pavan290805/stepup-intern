import {
  APPLICATION_STATUS,
  INTERNSHIP_STATUS,
  INTERVIEW_MODES,
  NOTIFICATION_TYPES,
  USER_ROLES,
  VERIFICATION_STATUS,
  WORK_MODES,
} from '@/constants';

const json = (schema: Record<string, unknown>, example?: unknown) => ({
  'application/json': {
    schema,
    ...(example !== undefined ? { example } : {}),
  },
});

const success = (description: string, dataSchema?: Record<string, unknown>, example?: unknown) => ({
  description,
  content: json(
    {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: description },
        ...(dataSchema ? { data: dataSchema } : {}),
      },
      required: ['success', 'message'],
    },
    example
  ),
});

const error = (description: string, statusCode: number) => ({
  description,
  content: json({
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: description },
      errors: {
        type: 'array',
        items: { type: 'string' },
        example: [`HTTP ${statusCode}: ${description}`],
      },
    },
    required: ['success', 'message'],
  }),
});

const authSecurity = [{ bearerAuth: [] }, { cookieAuth: [] }];

const paginatedMetaSchema = {
  type: 'object',
  properties: {
    total: { type: 'integer', example: 42 },
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 10 },
    pages: { type: 'integer', example: 5 },
  },
};

export function getOpenApiSpec() {
  const userRoleEnum = Object.values(USER_ROLES);
  const workModeEnum = Object.values(WORK_MODES);
  const internshipStatusEnum = Object.values(INTERNSHIP_STATUS);
  const applicationStatusEnum = Object.values(APPLICATION_STATUS);
  const interviewModeEnum = Object.values(INTERVIEW_MODES);
  const verificationStatusEnum = Object.values(VERIFICATION_STATUS);
  const notificationTypeEnum = Object.values(NOTIFICATION_TYPES);

  return {
    openapi: '3.1.0',
    info: {
      title: 'StepUpIntern Backend API',
      version: '1.0.0',
      description:
        'Interactive OpenAPI documentation for the StepUpIntern backend. Authenticated endpoints accept either a Bearer token or the httpOnly access token cookie.',
    },
    servers: [
      {
        url: '/api',
        description: 'Current application API base URL',
      },
    ],
    tags: [
      { name: 'Auth' },
      { name: 'Students' },
      { name: 'Recruiters' },
      { name: 'Companies' },
      { name: 'Internships' },
      { name: 'Saved Internships' },
      { name: 'Applications' },
      { name: 'Interviews' },
      { name: 'Notifications' },
      { name: 'Admin' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      parameters: {
        Page: {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        Limit: {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 10 },
        },
        Search: {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
        },
        Id: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      },
      schemas: {
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: userRoleEnum },
          },
          required: ['id', 'name', 'email', 'role'],
        },
        CurrentUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: userRoleEnum },
            profilePicture: { type: 'string', nullable: true },
            isVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, maxLength: 100 },
            role: { type: 'string', enum: userRoleEnum },
          },
          required: ['name', 'email', 'password', 'role'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
          required: ['email', 'password'],
        },
        RefreshTokenRequest: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
          required: ['accessToken', 'refreshToken'],
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/AuthUser' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        StudentProfileRequest: {
          type: 'object',
          properties: {
            headline: { type: 'string', maxLength: 100 },
            bio: { type: 'string', maxLength: 500 },
            resumeUrl: { type: 'string', format: 'uri' },
            linkedinUrl: { type: 'string', format: 'uri' },
            githubUrl: { type: 'string', format: 'uri' },
            portfolioUrl: { type: 'string', format: 'uri' },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  school: { type: 'string' },
                  degree: { type: 'string' },
                  field: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                },
                required: ['school', 'degree', 'field', 'startDate'],
              },
            },
            skills: { type: 'array', items: { type: 'string' } },
            certifications: { type: 'array', items: { type: 'string' } },
          },
        },
        RecruiterProfileRequest: {
          type: 'object',
          properties: {
            companyId: { type: 'string' },
            designation: { type: 'string', maxLength: 100 },
            phoneNumber: { type: 'string', pattern: '^\\+?[1-9]\\d{1,14}$' },
          },
          required: ['companyId', 'designation', 'phoneNumber'],
        },
        CompanyRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            industry: { type: 'string', maxLength: 50 },
            website: { type: 'string', format: 'uri' },
            description: { type: 'string', maxLength: 1000 },
            companySize: { type: 'string' },
            headquarters: { type: 'string', maxLength: 100 },
          },
          required: [
            'name',
            'industry',
            'website',
            'description',
            'companySize',
            'headquarters',
          ],
        },
        InternshipRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 5, maxLength: 100 },
            description: { type: 'string', minLength: 20, maxLength: 5000 },
            skillsRequired: { type: 'array', items: { type: 'string' } },
            location: { type: 'string', maxLength: 100 },
            workMode: { type: 'string', enum: workModeEnum },
            stipend: { type: 'number', minimum: 0 },
            duration: { type: 'string' },
            openings: { type: 'integer', minimum: 1 },
            deadline: { type: 'string', format: 'date-time' },
          },
          required: [
            'title',
            'description',
            'skillsRequired',
            'location',
            'workMode',
            'stipend',
            'duration',
            'openings',
            'deadline',
          ],
        },
        ApplicationCreateRequest: {
          type: 'object',
          properties: {
            internshipId: { type: 'string' },
            resumeUrl: { type: 'string', format: 'uri' },
          },
          required: ['internshipId'],
        },
        ApplicationStatusUpdateRequest: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: applicationStatusEnum },
            recruiterNotes: { type: 'string' },
          },
          required: ['status'],
        },
        InterviewCreateRequest: {
          type: 'object',
          properties: {
            applicationId: { type: 'string' },
            scheduledAt: { type: 'string', format: 'date-time' },
            mode: { type: 'string', enum: interviewModeEnum },
            meetingLink: { type: 'string', format: 'uri' },
          },
          required: ['applicationId', 'scheduledAt', 'mode'],
        },
        InterviewUpdateRequest: {
          type: 'object',
          properties: {
            scheduledAt: { type: 'string', format: 'date-time' },
            mode: { type: 'string', enum: interviewModeEnum },
            meetingLink: { type: 'string', format: 'uri' },
            status: {
              type: 'string',
              enum: ['scheduled', 'completed', 'cancelled'],
            },
            feedback: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
          },
        },
        SavedInternshipRequest: {
          type: 'object',
          properties: {
            internshipId: { type: 'string' },
          },
          required: ['internshipId'],
        },
        AdminUserStatusRequest: {
          type: 'object',
          properties: {
            isActive: { type: 'boolean' },
          },
          required: ['isActive'],
        },
        AdminActionRequest: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['verify', 'reject'],
            },
          },
          required: ['action'],
        },
        AdminInternshipStatusRequest: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: internshipStatusEnum },
          },
          required: ['status'],
        },
        Statistics: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer' },
            totalCompanies: { type: 'integer' },
            totalInternships: { type: 'integer' },
            totalApplications: { type: 'integer' },
            studentCount: { type: 'integer' },
            recruiterCount: { type: 'integer' },
          },
        },
        ResumeUploadResponse: {
          type: 'object',
          properties: {
            resumeUrl: { type: 'string', format: 'uri' },
          },
        },
        SavedStatusResponse: {
          type: 'object',
          properties: {
            isSaved: { type: 'boolean' },
          },
        },
        NotificationListResponse: {
          type: 'object',
          properties: {
            notifications: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            unreadCount: { type: 'integer' },
            pagination: paginatedMetaSchema,
          },
        },
        PaginatedUsersResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            pagination: paginatedMetaSchema,
          },
        },
        PaginatedCompaniesResponse: {
          type: 'object',
          properties: {
            companies: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            pagination: paginatedMetaSchema,
          },
        },
        PaginatedRecruitersResponse: {
          type: 'object',
          properties: {
            recruiters: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            pagination: paginatedMetaSchema,
          },
        },
        PaginatedInternshipsResponse: {
          type: 'object',
          properties: {
            internships: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            pagination: paginatedMetaSchema,
          },
        },
        PaginatedApplicationsResponse: {
          type: 'object',
          properties: {
            applications: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            pagination: paginatedMetaSchema,
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/RegisterRequest' }),
          },
          responses: {
            200: success('User registered successfully', {
              $ref: '#/components/schemas/RegisterResponse',
            }),
            400: error('Registration failed', 400),
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and issue auth cookies/tokens',
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/LoginRequest' }),
          },
          responses: {
            200: success('Logged in successfully', {
              $ref: '#/components/schemas/RegisterResponse',
            }),
            401: error('Login failed', 401),
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh the access token',
          requestBody: {
            required: false,
            content: json({ $ref: '#/components/schemas/RefreshTokenRequest' }),
          },
          responses: {
            200: success('Token refreshed', {
              $ref: '#/components/schemas/AuthTokens',
            }),
            401: error('Token refresh failed', 401),
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout the current user',
          security: authSecurity,
          responses: {
            200: success('Logged out successfully'),
            401: error('No token provided', 401),
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get the current authenticated user',
          security: authSecurity,
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/CurrentUser',
            }),
            401: error('Invalid or expired token', 401),
            404: error('User not found', 404),
          },
        },
      },
      '/students/profile': {
        post: {
          tags: ['Students'],
          summary: 'Create a student profile',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/StudentProfileRequest' }),
          },
          responses: {
            201: success('Student profile created successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to create profile', 400),
          },
        },
        get: {
          tags: ['Students'],
          summary: 'Get the current student profile',
          security: authSecurity,
          responses: {
            200: success('Success', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Student profile not found', 404),
          },
        },
        patch: {
          tags: ['Students'],
          summary: 'Update the current student profile',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/StudentProfileRequest' }),
          },
          responses: {
            200: success('Student profile updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update profile', 400),
          },
        },
      },
      '/students/resume': {
        post: {
          tags: ['Students'],
          summary: 'Upload a student resume',
          security: authSecurity,
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                  required: ['file'],
                },
              },
            },
          },
          responses: {
            201: success('Resume uploaded successfully', {
              $ref: '#/components/schemas/ResumeUploadResponse',
            }),
            400: error('Invalid file upload request', 400),
          },
        },
      },
      '/recruiters/profile': {
        post: {
          tags: ['Recruiters'],
          summary: 'Create a recruiter profile',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/RecruiterProfileRequest' }),
          },
          responses: {
            201: success('Recruiter profile created successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to create profile', 400),
          },
        },
        get: {
          tags: ['Recruiters'],
          summary: 'Get the current recruiter profile',
          security: authSecurity,
          responses: {
            200: success('Success', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Recruiter profile not found', 404),
          },
        },
        patch: {
          tags: ['Recruiters'],
          summary: 'Update the current recruiter profile',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/RecruiterProfileRequest' }),
          },
          responses: {
            200: success('Recruiter profile updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update profile', 400),
          },
        },
      },
      '/companies': {
        post: {
          tags: ['Companies'],
          summary: 'Create a company',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/CompanyRequest' }),
          },
          responses: {
            201: success('Company created successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to create company', 400),
          },
        },
        get: {
          tags: ['Companies'],
          summary: 'List companies',
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
            { $ref: '#/components/parameters/Search' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedCompaniesResponse',
            }),
            500: error('Failed to fetch companies', 500),
          },
        },
      },
      '/companies/{id}': {
        get: {
          tags: ['Companies'],
          summary: 'Get a company by id',
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Success', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Company not found', 404),
          },
        },
        patch: {
          tags: ['Companies'],
          summary: 'Update a company',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/CompanyRequest' }),
          },
          responses: {
            200: success('Company updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update company', 400),
          },
        },
      },
      '/internships': {
        post: {
          tags: ['Internships'],
          summary: 'Create an internship',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/InternshipRequest' }),
          },
          responses: {
            201: success('Internship created successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to create internship', 400),
          },
        },
        get: {
          tags: ['Internships'],
          summary: 'List internships',
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
            {
              name: 'location',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'workMode',
              in: 'query',
              schema: { type: 'string', enum: workModeEnum },
            },
            {
              name: 'company',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: internshipStatusEnum },
            },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedInternshipsResponse',
            }),
            500: error('Failed to fetch internships', 500),
          },
        },
      },
      '/internships/{id}': {
        get: {
          tags: ['Internships'],
          summary: 'Get an internship by id',
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Success', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Internship not found', 404),
          },
        },
        patch: {
          tags: ['Internships'],
          summary: 'Update an internship',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/InternshipRequest' }),
          },
          responses: {
            200: success('Internship updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update internship', 400),
          },
        },
        delete: {
          tags: ['Internships'],
          summary: 'Delete an internship',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Internship deleted successfully'),
            500: error('Failed to delete internship', 500),
          },
        },
      },
      '/internships/saved': {
        post: {
          tags: ['Saved Internships'],
          summary: 'Save an internship for the current student',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/SavedInternshipRequest' }),
          },
          responses: {
            201: success('Internship saved successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to save internship', 400),
          },
        },
        get: {
          tags: ['Saved Internships'],
          summary: 'List saved internships for the current student',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedInternshipsResponse',
            }),
            500: error('Failed to fetch saved internships', 500),
          },
        },
      },
      '/internships/saved/{id}': {
        get: {
          tags: ['Saved Internships'],
          summary: 'Check whether an internship is saved',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/SavedStatusResponse',
            }),
            500: error('Failed to check saved status', 500),
          },
        },
        delete: {
          tags: ['Saved Internships'],
          summary: 'Remove an internship from the saved list',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Internship removed from saved list'),
            500: error('Failed to remove saved internship', 500),
          },
        },
      },
      '/applications': {
        post: {
          tags: ['Applications'],
          summary: 'Create a student internship application',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/ApplicationCreateRequest' }),
          },
          responses: {
            201: success('Application submitted successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to submit application', 400),
          },
        },
        get: {
          tags: ['Applications'],
          summary: 'List current student applications',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedApplicationsResponse',
            }),
            500: error('Failed to fetch applications', 500),
          },
        },
      },
      '/applications/my': {
        get: {
          tags: ['Applications'],
          summary: 'List current student applications via alias route',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedApplicationsResponse',
            }),
            500: error('Failed to fetch applications', 500),
          },
        },
      },
      '/applications/{id}': {
        patch: {
          tags: ['Applications'],
          summary: 'Update an application status',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({
              $ref: '#/components/schemas/ApplicationStatusUpdateRequest',
            }),
          },
          responses: {
            200: success('Application status updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update application', 400),
          },
        },
        delete: {
          tags: ['Applications'],
          summary: 'Delete a student application',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Application deleted successfully'),
            500: error('Failed to delete application', 500),
          },
        },
      },
      '/interviews': {
        post: {
          tags: ['Interviews'],
          summary: 'Schedule an interview',
          security: authSecurity,
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/InterviewCreateRequest' }),
          },
          responses: {
            201: success('Interview scheduled successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to schedule interview', 400),
          },
        },
      },
      '/interviews/{id}': {
        get: {
          tags: ['Interviews'],
          summary: 'Get an interview by id',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Success', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Interview not found', 404),
          },
        },
        patch: {
          tags: ['Interviews'],
          summary: 'Update an interview',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/InterviewUpdateRequest' }),
          },
          responses: {
            200: success('Interview updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update interview', 400),
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'List notifications for the current user',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
            {
              name: 'unreadOnly',
              in: 'query',
              schema: { type: 'boolean', default: false },
            },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/NotificationListResponse',
            }),
            500: error('Failed to fetch notifications', 500),
          },
        },
      },
      '/notifications/{id}': {
        patch: {
          tags: ['Notifications'],
          summary: 'Mark a notification as read',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Notification marked as read', {
              type: 'object',
              additionalProperties: true,
            }),
            404: error('Notification not found', 404),
          },
        },
        delete: {
          tags: ['Notifications'],
          summary: 'Delete a notification',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Notification deleted successfully'),
            500: error('Failed to delete notification', 500),
          },
        },
      },
      '/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'List platform users',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
            { $ref: '#/components/parameters/Search' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedUsersResponse',
            }),
            500: error('Failed to fetch users', 500),
          },
        },
      },
      '/admin/users/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update a user active status',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/AdminUserStatusRequest' }),
          },
          responses: {
            200: success('User status updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update user', 400),
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a user',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('User deleted successfully'),
            500: error('Failed to delete user', 500),
          },
        },
      },
      '/admin/recruiters': {
        get: {
          tags: ['Admin'],
          summary: 'List pending recruiters',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedRecruitersResponse',
            }),
            500: error('Failed to fetch recruiters', 500),
          },
        },
      },
      '/admin/recruiters/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Verify or reject a recruiter profile',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/AdminActionRequest' }),
          },
          responses: {
            200: success('Recruiter updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update recruiter', 400),
          },
        },
      },
      '/admin/companies': {
        get: {
          tags: ['Admin'],
          summary: 'List pending companies',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedCompaniesResponse',
            }),
            500: error('Failed to fetch companies', 500),
          },
        },
      },
      '/admin/companies/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Verify or reject a company',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({ $ref: '#/components/schemas/AdminActionRequest' }),
          },
          responses: {
            200: success('Company updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update company', 400),
          },
        },
      },
      '/admin/internships': {
        get: {
          tags: ['Admin'],
          summary: 'List all internships for administration',
          security: authSecurity,
          parameters: [
            { $ref: '#/components/parameters/Page' },
            { $ref: '#/components/parameters/Limit' },
          ],
          responses: {
            200: success('Success', {
              $ref: '#/components/schemas/PaginatedInternshipsResponse',
            }),
            500: error('Failed to fetch internships', 500),
          },
        },
      },
      '/admin/internships/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update internship status',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          requestBody: {
            required: true,
            content: json({
              $ref: '#/components/schemas/AdminInternshipStatusRequest',
            }),
          },
          responses: {
            200: success('Internship status updated successfully', {
              type: 'object',
              additionalProperties: true,
            }),
            400: error('Failed to update internship', 400),
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete an internship as admin',
          security: authSecurity,
          parameters: [{ $ref: '#/components/parameters/Id' }],
          responses: {
            200: success('Internship deleted successfully'),
            500: error('Failed to delete internship', 500),
          },
        },
      },
      '/admin/statistics': {
        get: {
          tags: ['Admin'],
          summary: 'Get platform statistics',
          security: authSecurity,
          responses: {
            200: success('Success', {
              type: 'object',
              properties: {
                statistics: { $ref: '#/components/schemas/Statistics' },
              },
            }),
            500: error('Failed to fetch statistics', 500),
          },
        },
      },
    },
    'x-enums': {
      roles: userRoleEnum,
      workModes: workModeEnum,
      internshipStatuses: internshipStatusEnum,
      applicationStatuses: applicationStatusEnum,
      interviewModes: interviewModeEnum,
      verificationStatuses: verificationStatusEnum,
      notificationTypes: notificationTypeEnum,
    },
  };
}
