import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
    const { name, email, password, username } = req.body;

    try {
        // Create user data object with only provided fields
        const userData = {
            name,
            email,
            password,
        };

        // Only add username if provided
        if (username) {
            userData.username = username;
        }

        const user = await User.create(userData);
        sendToken(user, 201, res);
    } catch (error) {
        // Handle duplicate key error for username
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            return next(new ErrorResponse('Username already exists', 400));
        }
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorResponse('Please enter email & password', 400));
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/users/logout
// @access  Private
export const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me/update
// @access  Private
export const updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // Update avatar: TODO

    try {
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/users/password/update
// @access  Private
export const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatched = await user.matchPassword(req.body.currentPassword);
    if (!isMatched) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
};

// @desc    Forgot password
// @route   POST /api/users/password/forgot
// @access  Public
export const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/password/reset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
};

// @desc    Reset password
// @route   PUT /api/users/password/reset/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user details (admin)
// @route   GET /api/admin/user/:id
// @access  Private/Admin
export const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id: ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/user/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    try {
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id: ${req.params.id}`, 404)
            );
        }

        // TODO: Remove user avatar from cloudinary

        await user.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get token from model, create cookie and send response
const sendToken = (user, statusCode, res) => {
    // Create token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
};
