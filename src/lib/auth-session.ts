import type { JwtPayload, UserRole } from '@/types';

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function getAuthRoleFromToken(token?: string) {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    if (payload.role === 'student' || payload.role === 'recruiter' || payload.role === 'admin') {
      return payload.role as UserRole;
    }

    return null;
  } catch {
    return null;
  }
}

export function getAuthenticatedRedirectPath(token?: string) {
  const role = getAuthRoleFromToken(token);

  if (role === 'recruiter') {
    return '/recruiter';
  }

  if (role === 'student') {
    return '/internships';
  }

  return null;
}