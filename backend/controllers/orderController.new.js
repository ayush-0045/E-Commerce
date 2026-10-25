import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingInfo,
            billingInfo,
            shippingMethod,
            paymentMethod,
            coupon,
            notes,
            isGift,
            giftMessage,
            giftSenderName,
            giftRecipientEmail,
            giftRecipientName,
            giftDeliverAt
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return next(new ErrorResponse('No order items provided', 400));
        }

        // Calculate order totals in INR
        const subtotal = orderItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || item.qty || 1)), 0);
        const shippingAmount = subtotal > 50000 ? 0 : (shippingMethod?.price || 0); // Free insured shipping above ₹50,000
        const taxRate = 0.03; // Standard 3% Indian GST for jewelry
        const taxAmount = Math.round(subtotal * taxRate);
        const discountAmount = 0;
        const total = Math.round(subtotal + shippingAmount + taxAmount - discountAmount);

        const orderNumber = `ORD-GAH-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const userId = req.user._id || req.user.id;

        const orderData = {
            orderNumber,
            user: userId,
            orderItems: orderItems.map(item => ({
                product: item.productId || item.product || item.id,
                name: item.name,
                price: Number(item.price),
                originalPrice: Number(item.originalPrice || item.price),
                quantity: Number(item.quantity || item.qty || 1),
                images: item.images || (item.image ? [item.image] : []),
                sku: item.sku || 'GAH-JEW',
                metalType: item.metalType || 'Gold',
                metalPurity: item.metalPurity || '22K',
                gemstoneType: item.gemstoneType || 'None',
                size: item.size || 'Standard',
                customizationNotes: item.customizationNotes || ''
            })),
            shippingInfo: {
                ...shippingInfo,
                isBillingSame: billingInfo ? false : true
            },
            billingInfo: billingInfo || shippingInfo,
            shippingMethod: {
                name: shippingMethod?.name || 'Insured Express Delivery',
                price: shippingAmount,
                estimatedDelivery: '3-5 business days'
            },
            paymentInfo: {
                method: paymentMethod || 'cash_on_delivery',
                status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
            },
            subtotal,
            taxAmount,
            shippingAmount,
            discountAmount,
            total,
            currency: 'INR',
            status: 'processing',
            createdAt: new Date(),
        };

        let order;
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState !== 1) {
            const { db } = await import('../services/embeddedDb.js');
            order = await db.orders.insertAsync(orderData);
        } else {
            order = await Order.create(orderData);
        }

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name images price');

        if (!order) {
            return next(new ErrorResponse('No order found with this ID', 404));
        }

        // Check if user is authorized to view this order
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to view this order', 403));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user orders
// @route   GET /api/orders/me
// @access  Private
export const myOrders = async (req, res, next) => {
    try {
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState !== 1) {
            const { db } = await import('../services/embeddedDb.js');
            const orders = await db.orders.findAsync({ user: req.user._id || req.user.id });
            return res.status(200).json({
                success: true,
                count: orders.length,
                orders
            });
        }

        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .select('-notes -metadata -ipAddress -userAgent -referrer');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders - Admin
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState !== 1) {
            const { db } = await import('../services/embeddedDb.js');
            const orders = await db.orders.findAsync({});
            return res.status(200).json({
                success: true,
                count: orders.length,
                total: orders.length,
                page: 1,
                pages: 1,
                orders
            });
        }
        const { status, startDate, endDate, search } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        // Search by order number, customer name, or email
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingInfo.firstName': { $regex: search, $options: 'i' } },
                { 'shippingInfo.lastName': { $regex: search, $options: 'i' } },
                { 'shippingInfo.email': { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status - Admin
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, note, notifyCustomer } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return next(new ErrorResponse('Order not found', 404));
        }

        // Validate status transition
        const validStatuses = ['pending', 'processing', 'on_hold', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'failed'];
        if (!validStatuses.includes(status)) {
            return next(new ErrorResponse('Invalid order status', 400));
        }

        // Update order status
        order.status = status;
        
        // Add tracking info if provided
        if (req.body.trackingNumber) {
            order.shippingMethod.trackingNumber = req.body.trackingNumber;
            order.shippingMethod.carrier = req.body.carrier || order.shippingMethod.carrier;
            order.shippingMethod.trackingUrl = req.body.trackingUrl || order.shippingMethod.trackingUrl;
        }

        // Add note if provided
        if (note) {
            order.notes.push({
                note,
                createdBy: req.user._id,
                isCustomerNotified: notifyCustomer || false
            });
        }

        // If order is cancelled or refunded, update product stock
        if ((status === 'cancelled' || status === 'refunded') && order.status !== 'cancelled' && order.status !== 'refunded') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity, sold: -item.quantity }
                });
            }
        }

        // If order is marked as paid
        if (status === 'processing' && order.paymentInfo.status !== 'paid') {
            order.paymentInfo.status = 'paid';
            order.paymentInfo.paidAt = Date.now();
        }

        await order.save();

        // Send notification to customer if requested
        if (notifyCustomer) {
            await sendOrderStatusUpdateEmail(order, note || `Your order status has been updated to: ${status}`);
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete order - Admin
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return next(new ErrorResponse('Order not found', 404));
        }

        // If order is not cancelled/refunded, update product stock
        if (order.status !== 'cancelled' && order.status !== 'refunded') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity, sold: -item.quantity }
                });
            }
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sales statistics - Admin
// @route   GET /api/admin/orders/sales/stats
// @access  Private/Admin
export const getSalesStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const match = {};
        
        // Filter by date range
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                match.createdAt.$lte = end;
            }
        }

        // Only count completed orders for sales stats
        match.status = 'completed';

        const stats = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: "$total" },
                    totalTax: { $sum: "$taxAmount" },
                    totalShipping: { $sum: "$shippingAmount" },
                    totalDiscount: { $sum: "$discountAmount" },
                    totalProductsSold: { $sum: { $size: "$orderItems" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSales: 1,
                    totalOrders: 1,
                    avgOrderValue: { $round: ["$avgOrderValue", 2] },
                    totalTax: 1,
                    totalShipping: 1,
                    totalDiscount: 1,
                    totalProductsSold: 1
                }
            }
        ]);

        // Get sales by category
        const salesByCategory = await Order.aggregate([
            { $match: match },
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $group: {
                    _id: "$productInfo.category",
                    totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
                    totalItems: { $sum: "$orderItems.quantity" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        // Get sales over time (daily, weekly, monthly)
        const salesOverTime = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    totalSales: { $sum: "$total" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {
                totalSales: 0,
                totalOrders: 0,
                avgOrderValue: 0,
                totalTax: 0,
                totalShipping: 0,
                totalDiscount: 0,
                totalProductsSold: 0
            },
            salesByCategory,
            salesOverTime
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
    try {
        const message = `
            <h2>Thank you for your order, ${user.name}!</h2>
            <p>Your order has been received and is being processed.</p>
            <h3>Order #${order.orderNumber}</h3>
            <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total Amount: $${order.total.toFixed(2)}</p>
            <h4>Order Items:</h4>
            <ul>
                ${order.orderItems.map(item => `
                    <li>${item.quantity} x ${item.name} - $${item.price.toFixed(2)}</li>
                `).join('')}
            </ul>
            <p>Shipping to: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}</p>
            <p>If you have any questions about your order, please contact our support team.</p>
            <p>Thank you for shopping with us!</p>
        `;

        await sendEmail({
            email: user.email,
            subject: `Order Confirmation - #${order.orderNumber}`,
            message
        });
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// Helper function to send order status update email
const sendOrderStatusUpdateEmail = async (order, message) => {
    try {
        const user = await User.findById(order.user);
        
        const emailMessage = `
            <h2>Order #${order.orderNumber} Status Update</h2>
            <p>${message}</p>
            <p>Current Status: <strong>${order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}</strong></p>
            ${order.shippingMethod?.trackingNumber ? `
                <p>Tracking Number: ${order.shippingMethod.trackingNumber}</p>
                ${order.shippingMethod?.trackingUrl ? `<p>Track your order: <a href="${order.shippingMethod.trackingUrl}">${order.shippingMethod.trackingUrl}</a></p>` : ''}
            ` : ''}
            <p>If you have any questions, please contact our support team.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: `Order #${order.orderNumber} Status Update`,
            message: emailMessage
        });
    } catch (error) {
        console.error('Error sending order status update email:', error);
    }
};
