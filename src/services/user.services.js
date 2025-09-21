import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);

    logger.info(`Retrieved ${allUsers.length} users`);
    return allUsers;
  } catch (err) {
    logger.error('Error getting all users:', err);
    throw err;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    logger.info(`Retrieved user with id: ${id}`);
    return user;
  } catch (err) {
    logger.error(`Error getting user by id ${id}:`, err);
    throw err;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const _existingUser = await getUserById(id);

    // Prepare update data
    const updateData = { ...updates };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Add updated timestamp
    updateData.updated_at = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User updated successfully: ${updatedUser.email}`);
    return updatedUser;
  } catch (err) {
    logger.error(`Error updating user with id ${id}:`, err);
    throw err;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists
    const _existingUser = await getUserById(id);

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    logger.info(`User deleted successfully: ${deletedUser.email}`);
    return deletedUser;
  } catch (err) {
    logger.error(`Error deleting user with id ${id}:`, err);
    throw err;
  }
};
