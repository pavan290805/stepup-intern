type AuthPayload = {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'recruiter' | 'admin';
  };
  accessToken: string;
  refreshToken: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthPayload;
  errors?: string[];
};

async function postAuthRequest<TBody extends Record<string, unknown>>(url: string, body: TBody) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as AuthResponse;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || 'Authentication failed');
  }

  return payload.data;
}

export function loginUser(input: { email: string; password: string }) {
  return postAuthRequest('/api/auth/login', input);
}

export function signupStudent(input: { name: string; email: string; password: string }) {
  return postAuthRequest('/api/auth/register', {
    ...input,
    role: 'student',
  });
}

export function signupRecruiter(input: {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  companyEmail?: string;
  companyWebsite?: string;
  industry?: string;
}) {
  return postAuthRequest('/api/auth/register', {
    ...input,
    role: 'recruiter',
  });
}