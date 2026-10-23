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
router.route('/orders').post(isAuthenticatedUser, createOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/orders/sales/stats').get(isAuthenticatedUser, authorizeRoles('admin'), getSalesStats);
router.route('/admin/orders/:id/status')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.route('/admin/orders/:id')
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;
