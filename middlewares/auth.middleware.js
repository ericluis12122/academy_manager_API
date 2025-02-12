import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        next(); // Permite el acceso si es admin
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const authorize = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({ message: 'Unauthorize' });
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('_id name email role');
        if(!user) return res.status(401).json({ message: 'Unauthorize' });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorize', error: error.message });
    }
};