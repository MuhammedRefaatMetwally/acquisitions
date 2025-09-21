import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
} from '#middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, fetchAllUsers);

router.get('/:id', authenticateToken, requireOwnershipOrAdmin, fetchUserById);

router.put('/:id', authenticateToken, updateUserById);

router.delete('/:id', authenticateToken, deleteUserById);

export default router;
