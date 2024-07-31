import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validUser from '../middlewares/validUser.js';

const router = express.Router();

// import '../loadEnv.js'; // Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Secret key for JWT (this should be stored in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Handle POST request to the login route
router.post('/', validUser, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not Found."
            });
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Set token as HttpOnly cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'None', // Allow cross-site cookies
            maxAge: 86400000 // 24 hours in milliseconds
        });

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color

            }
        });

    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
});

export default router;
