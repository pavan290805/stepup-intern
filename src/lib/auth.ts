import { JwtPayload } from '@/types';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';
const JWT_EXPIRE = (process.env.JWT_EXPIRE || '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRE = (process.env.JWT_REFRESH_EXPIRE || '7d') as SignOptions['expiresIn'];

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export function generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    console.log("Verified:", decoded);

    return decoded;
  } catch (error) {
    console.error("JWT verify error:", error);
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;

    console.log("Verified Refresh Token:", decoded);

    return decoded;
  } catch (error) {
    console.error("JWT verify error:", error);
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    console.log("Decoding token:", token);
    const decoded = jwt.decode(token) as JwtPayload;
    console.log("Decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}
