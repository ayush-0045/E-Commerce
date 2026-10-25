import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { db } from '../services/embeddedDb.js';

// Protect routes - checks if user is authenticated
export const isAuthenticatedUser = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Please login to access this resource', 401));
    }

    try {
        // Verify token
        const secret = process.env.JWT_SECRET || 'dev_secret_key_change_in_production_7a9f8b2c';
        const decoded = jwt.verify(token, secret);

        if (mongoose.connection.readyState !== 1) {
            req.user = await db.users.findOneAsync({ _id: decoded.id });
        } else {
            req.user = await User.findById(decoded.id);
        }

        if (!req.user) {
            return next(new ErrorResponse('User not found', 401));
        }
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Authorize user roles (alias for authorize - both do the same thing)
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorResponse('User not authenticated', 401));
        }
        
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};

// Alias for authorizeRoles to maintain backward compatibility
export const authorize = authorizeRoles;
