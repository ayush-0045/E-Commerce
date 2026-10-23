import Stripe from 'stripe';
import Order from '../models/Order.js';
import ErrorResponse from '../utils/errorResponse.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Process payment
// @route   POST /api/payment/process
// @access  Private
export const processPayment = async (req, res, next) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' }
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send Stripe API Key
// @route   GET /api/stripeapi
// @access  Private
export const sendStripeApi = async (req, res, next) => {
    try {
        res.status(200).json({
            stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        next(error);
    }
};
