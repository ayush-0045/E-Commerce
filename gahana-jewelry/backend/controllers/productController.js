import Product from '../models/Product.js';
import ErrorResponse from '../utils/errorResponse.js';
import APIFeatures from '../utils/apiFeatures.js';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const resPerPage = 8;
        const productsCount = await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resPerPage);

        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: products.length,
            productsCount,
            resPerPage,
            products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/admin/product/new
// @access  Private/Admin
export const newProduct = async (req, res, next) => {
    try {
        let images = [];
        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'gahana-jewelry/products',
                width: 150,
                crop: 'scale',
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        req.body.images = imagesLinks;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product details
// @route   GET /api/product/:id
// @access  Public
export const getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/admin/product/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        let images = [];
        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        if (images !== undefined) {
            // Delete images associated with the product
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            let imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'gahana-jewelry/products',
                    width: 150,
                    crop: 'scale',
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/admin/product/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        // Delete images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: 'Product is deleted'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new review
// @route   PUT /api/review
// @access  Private
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            // Update the existing review
            product.reviews.forEach(review => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment;
                    review.rating = rating;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        // Calculate average rating
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product reviews
// @route   GET /api/reviews
// @access  Private
export const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);

        res.status(200).json({
            success: true,
            reviews: product.reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product review
// @route   DELETE /api/reviews
// @access  Private
export const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        const reviews = product.reviews.filter(
            review => review._id.toString() !== req.query.id.toString()
        );

        const numOfReviews = reviews.length;

        const ratings = numOfReviews === 0 ? 0 : product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
};
