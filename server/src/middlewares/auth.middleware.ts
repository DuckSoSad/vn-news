import type { NextFunction, Response } from 'express';
import authRepository from '../repository/client/auth.repository.js';
import type { AuthRequest } from '../types/auth-request.type.js';
import { verifyAccessToken } from '../utils/auth.js';

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No access granted. Please log in!',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token as string);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'The token is invalid or has expired.',
      });
    }

    const user = await authRepository.findById(decoded.userId);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        status: 'error',
        message: 'The token is invalid or has expired.',
      });
    }

    req.user = decoded;

    next();
  } catch (_error) {
    res.status(401).json({
      status: 'error',
      message: 'The token is invalid or has expired.',
    });
  }
}
