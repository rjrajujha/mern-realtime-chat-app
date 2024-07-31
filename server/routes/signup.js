import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validUser from '../middlewares/validUser.js';

const router = express.Router();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable for secret

// Handle POST request to the signup route
router.post('/', validUser, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check whether user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                message: "User already exists"
            });
        }

        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign(
            { email: newUser.email, userId: newUser._id },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expiration time
        );

        // Set token as HttpOnly cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'None', // Allow cross-site cookies
            maxAge: 86400000 // 24 hours in milliseconds
        });

        return res.status(201).json({
            status: "success",
            message: "User successfully created",
            user: {
                id: newUser._id,
                email: newUser.email,
                profileSetup: newUser.profileSetup,
            },
        });

    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
});

export default router;
