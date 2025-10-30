import express from 'express';
import { getAllUsers, signinUser, signupUser } from '../Controllers/userController';

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signupUser);
router.post('/signin', signinUser);
router.get('/all', getAllUsers); // 🟢 New route

export default router;
