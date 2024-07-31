import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

// Handle GET request to fetch user data
router.get('/', verifyToken, async (req, res) => {
    try {
        // Extract user information from the request object
        const { userId } = req.user;

        // Fetch user data from the database using userId
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found."
            });
        }

        // Return user data
        res.status(200).json({
            status: "success",
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
        // Handle any errors that occur
        console.error('Error fetching user data:', err);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
});

export default router;
