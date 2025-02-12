import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String, 
        required: [true, 'User email is required'],
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email address']
    },
    verificationToken: { 
        type: String, 
        default: null 
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String, 
        required: [true, 'User password is required'],
        minLength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;