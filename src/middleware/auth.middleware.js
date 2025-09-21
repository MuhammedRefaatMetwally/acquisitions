import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      cookies.get(req, 'token') ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
      });
    }

    const decoded = jwtToken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email}`);
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  next();
};

export const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  const userId = parseInt(req.params.id);
  const isOwner = req.user.id === userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You can only access your own resources',
    });
  }

  next();
};
