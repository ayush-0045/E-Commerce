import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0.0
    },
    originalPrice: {
        type: Number,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    shortDescription: {
        type: String,
        maxLength: 200
    },
    sku: {
        type: String,
        unique: true
    },
    weight: {
        type: Number,
        default: 0
    },
    metalType: {
        type: String,
        enum: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone', 'Other'],
        required: true
    },
    metalPurity: {
        type: String,
        enum: ['14K', '18K', '22K', '24K', '92.5', 'Other'],
        default: '18K'
    },
    gemstoneType: {
        type: String,
        enum: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Other', 'None'],
        default: 'None'
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            isPrimary: {
                type: Boolean,
                default: false
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: [
            'Rings',
            'Necklaces',
            'Earrings',
            'Bracelets',
            'Bangles',
            'Pendants',
            'Nose Pins',
            'Anklets',
            'Mangalsutras',
            'Men\'s Collection',
            'Bridal Collection',
            'Daily Wear',
            'Festive Collection',
            'Antique',
            'Temple',
            'Kids'
        ]
    },
    subCategory: {
        type: String,
        required: false
    },
    collections: [{
        type: String,
        enum: ['New Arrivals', 'Best Sellers', 'Trending', 'Limited Edition', 'Sale']
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    saleEndDate: {
        type: Date
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default: 1
    },
    sold: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: true
            },
            images: [{
                public_id: String,
                url: String
            }],
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    specifications: {
        type: Map,
        of: String
    },
    careInstructions: [String],
    shippingInfo: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ['cm', 'inch'],
                default: 'cm'
            }
        },
        isEligibleForFreeShipping: {
            type: Boolean,
            default: false
        }
    },
    tags: [String],
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
