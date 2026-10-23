import express from 'express';
const router = express.Router();
import {
    getProducts,
    getAdminProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} from '../controllers/productController.js';

import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

// Public routes
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

// Protected routes
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReviews);
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

// Admin routes
router.route('/admin/products').get(getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

export default router;
