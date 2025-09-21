import logger from '#config/logger.js';
import { getAllUsers } from '#services/user.services.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');

    const allUsers = getAllUsers();
    res.json({
      message: 'Successfully fetching all users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};
