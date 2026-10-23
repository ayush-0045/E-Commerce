import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    shippingInfo: {
        firstName: {
            type: String,
            required: [true, 'Please enter first name']
        },
        lastName: {
            type: String,
            required: [true, 'Please enter last name']
        },
        email: {
            type: String,
            required: [true, 'Please enter email']
        },
        phone: {
            type: String,
            required: [true, 'Please enter contact number']
        },
        address: {
            type: String,
            required: [true, 'Please enter shipping address']
        },
        apartment: String,
        city: {
            type: String,
            required: [true, 'Please enter shipping city']
        },
        state: {
            type: String,
            required: [true, 'Please enter shipping state']
        },
        country: {
            type: String,
            required: [true, 'Please enter shipping country']
        },
        postalCode: {
            type: String,
            required: [true, 'Please enter postal code']
        },
        isBillingSame: {
            type: Boolean,
            default: true
        },
        saveInfo: {
            type: Boolean,
            default: false
        }
    },
    billingInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        apartment: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            originalPrice: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            images: [{
                type: String
            }],
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            sku: String,
            metalType: String,
            metalPurity: String,
            gemstoneType: String,
            size: String,
            customizationNotes: String
        }
    ],
    paymentInfo: {
        method: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery', 'other'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'voided', 'failed'],
            default: 'pending'
        },
        transactionId: String,
        paymentIntentId: String,
        receiptUrl: String,
        cardLast4: String,
        cardBrand: String,
        paidAt: Date
    },
    shippingMethod: {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        estimatedDelivery: String,
        trackingNumber: String,
        carrier: String,
        trackingUrl: String
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    discountAmount: {
        type: Number,
        default: 0.0
    },
    coupon: {
        code: String,
        discountType: {
            type: String,
            enum: ['percentage', 'fixed_amount']
        },
        discountValue: Number
    },
    total: {
        type: Number,
        required: true,
        default: 0.0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'on_hold',
            'shipped',
            'delivered',
            'completed',
            'cancelled',
            'refunded',
            'failed'
        ],
        default: 'pending'
    },
    notes: [{
        note: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        isCustomerNotified: {
            type: Boolean,
            default: false
        }
    }],
    ipAddress: String,
    userAgent: String,
    referrer: String,
    source: {
        type: String,
        enum: ['web', 'mobile', 'in_store', 'phone', 'other'],
        default: 'web'
    },
    metadata: {
        type: Map,
        of: String
    },
    isGift: {
        type: Boolean,
        default: false
    },
    giftMessage: String,
    giftSenderName: String,
    giftRecipientEmail: String,
    giftRecipientName: String,
    giftDeliverAt: Date,
    isArchived: {
        type: Boolean,
        default: false
    },
    archivedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD-${Date.now().toString().slice(-6)}-${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

// Update order status history when status changes
orderSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.notes.push({
            note: `Order status changed to ${this.status}`,
            isCustomerNotified: true
        });
    }
    next();
});

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'user': 1, 'createdAt': -1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'shippingInfo.email': 1 });
orderSchema.index({ 'shippingInfo.phone': 1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
