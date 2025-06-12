import express from 'express';
import { forgotPassword, getUsers, login, resetPassword, signup, verifyOTP } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/sign-up', upload.single("profileImg") , signup);
router.post('/login', login);
router.post('/send-otp', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)
router.get('/get-users', getUsers)

export default router