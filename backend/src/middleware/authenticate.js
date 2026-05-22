import jwt from 'jsonwebtoken';
import { apiResponse } from '../utils/apiResponse.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiResponse.error(res, 'Authentication required', 'UNAUTHORIZED', {}, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
    if (!user) {
      return apiResponse.error(res, 'User not found', 'UNAUTHORIZED', {}, 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return apiResponse.error(res, 'Token expired', 'TOKEN_EXPIRED', {}, 401);
    }
    return apiResponse.error(res, 'Invalid token', 'TOKEN_INVALID', {}, 401);
  }
};
