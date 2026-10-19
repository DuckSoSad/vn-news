import { compare, hash } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import { HandleError } from '../errors/handle-error.js';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = '1d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

if (!process.env.JWT_SECRET) {
  throw new HandleError(
    404,
    '❌ JWT_SECRET has not been configured in the .env file!',
  );
}
if (!process.env.JWT_REFRESH_SECRET) {
  throw new HandleError(
    404,
    '❌ JWT_REFRESH_SECRET has not been configured in the .env file!',
  );
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS);
}

export async function checkPassword(
  password: string,
  userPassword: string,
): Promise<boolean> {
  return await compare(password, userPassword);
}

export function generateAccessToken(payload: {
  userId: string;
  role: string;
  tokenVersion: number;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function generateRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as {
      userId: string;
      role: string;
      tokenVersion: number;
    };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
