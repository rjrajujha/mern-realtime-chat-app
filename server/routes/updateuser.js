import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import User from '../models/UserModel.js';

const router = express.Router();

// Handle GET request to fetch user data
router.post('/', verifyToken, async (req, res) => {
    try {

        // Extract user information from the request object
        const { userId, email } = req.user;

        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        if (email !== req.body.email) {
            return res.status(400).json({
                status: "failed",
                message: "Email Can't be updated"
            });
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true
        }, { new: true });

        return res.status(200).json({
            status: "success",
            message: "Profile Updated",
            user: {
                id: userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        });

    } catch (error) {
        // Handle any errors that occur
        console.error('Error fetching user data:', error);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
});

export default router;
