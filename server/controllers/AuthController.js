import express from 'express';

const router = express.Router();

// Define your routes here
import loginRouter from '../routes/login.js';
import signupRouter from '../routes/signup.js';
import userRouter from '../routes/userinfo.js';
import updateUserRouter from '../routes/updateuser.js';
import { updateUserImageRouter, deleteUserImageRouter } from '../routes/updateuserimage.js';

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/user-info', userRouter);
router.use('/update-profile', updateUserRouter);
router.use('/update-profile-image', updateUserImageRouter);
router.use('/delete-profile-image', deleteUserImageRouter);

// Export the router
export default router;
