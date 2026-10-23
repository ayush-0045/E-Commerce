import express from 'express';
const router = express.Router();
import { processPayment, sendStripeApi } from '../controllers/paymentController.js';
import { isAuthenticatedUser } from '../middleware/auth.js';

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApi);

export default router;
