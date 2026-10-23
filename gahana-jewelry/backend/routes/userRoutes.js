import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    updatePassword,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';

import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

// Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

export default router;
