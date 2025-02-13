import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { sendVerificationEmail, sendGuideEmail } from "../services/email.service.js";

export const SignUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Get data from client request
        const { name, email, password } = req.body;
        // Check is user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        // Create new user
        const [newUser] = await User.create([{ name, email, password: hashedPassword, verificationToken }], { session });
        // Send verification email
        sendVerificationEmail(email, verificationToken);
        sendGuideEmail(email);
        // Commit Transaction
        await session.commitTransaction();
        session.endSession();
        // Create response for client
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
    
export const SignIn = async (req, res, next) => {
    try {
        // Get data from client request
        const {email, password} = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if(!user || !user.emailVerified) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        // Create user token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Create response for client
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

export const VerifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            const error = new Error('Invalid or expired verification token');
            error.statusCode = 400;
            throw error;
        }
        
        user.verificationToken = null;
        user.emailVerified = true;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now log in.'
        });
    } catch (error) {
        next(error);
    }
};
