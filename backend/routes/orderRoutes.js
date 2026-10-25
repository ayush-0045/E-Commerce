import express from 'express';
const router = express.Router();
import {
    createOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getSalesStats
} from '../controllers/orderController.new.js';

import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

// User routes
router.route('/').post(isAuthenticatedUser, createOrder);
router.route('/new').post(isAuthenticatedUser, createOrder);
router.route('/me').get(isAuthenticatedUser, myOrders);
router.route('/:id').get(isAuthenticatedUser, getSingleOrder);

// Admin routes
router.route('/admin/all').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/sales/stats').get(isAuthenticatedUser, authorizeRoles('admin'), getSalesStats);
router.route('/admin/:id/status')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.route('/admin/:id')
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;
