import logger from '#config/logger.js';
import { formatValidationError } from '#utils/formate.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/user.services.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/user.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');

    const allUsers = await getAllUsers();
    res.status(200).json({
      message: 'Successfully retrieved all users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error fetching all users:', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    // Validate user ID
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUserById(id);

    res.status(200).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user by id ${req.params.id}:`, error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate user ID
    const idValidation = userIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidation.error),
      });
    }

    // Validate update data
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = idValidation.data;
    const updates = bodyValidation.data;
    const currentUser = req.user;

    // Authorization checks
    const isOwner = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    // Only admin can change user roles
    if (updates.role && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles',
      });
    }

    // Users can't change their own role (prevent privilege escalation)
    if (updates.role && isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You cannot change your own role',
      });
    }

    const updatedUser = await updateUser(id, updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating user with id ${req.params.id}:`, error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    // Validate user ID
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const currentUser = req.user;

    // Authorization checks
    const isOwner = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    // Prevent users from deleting themselves (optional business rule)
    if (isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message:
          'You cannot delete your own account. Please contact an administrator.',
      });
    }

    const deletedUser = await deleteUser(id);

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    logger.error(`Error deleting user with id ${req.params.id}:`, error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    next(error);
  }
};
