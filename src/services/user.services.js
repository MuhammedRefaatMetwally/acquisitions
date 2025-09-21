import logger from '#config/logger.js';

import { db } from '#config/database.js';

import { users } from '#models/user.model.js';

export const getAllUsers = async () => {
  try {
    return await db.select({
      id:users.id,
      email: users.email,
      password: users.password,
      role: user.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    }).from(users);

  } catch (err) {
    logger.error('Error getting users', err);
    throw err;
  }
};
