import express from 'express';
import { fetchAllUsers } from '#controllers/user.controller.js';

const router = express.Router();
router.get('/', fetchAllUsers);
router.get('/:id', (req, res) => {});
router.put('/:id', (req, res) => {});
router.delete('/:id', (req, res) => {});

export default router;
