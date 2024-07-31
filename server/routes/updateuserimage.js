import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import User from '../models/UserModel.js';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

const upload = multer({ dest: 'uploads/temp/' }); // Temp storage for multer

const updateUserImageRouter = express.Router();
const deleteUserImageRouter = express.Router();

// Handle POST request to update user profile
updateUserImageRouter.post('/', verifyToken, upload.single('profile-image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'failed',
                message: 'File required',
            });
        }

        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthorized',
            });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'mern-realtime-chat-app',
            use_filename: true,
            unique_filename: true,
        });

        // Clean up temporary file
        await unlinkAsync(req.file.path);

        // Update user profile with Cloudinary image URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: result.secure_url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Profile Picture Uploaded',
            image: updatedUser.image,
        });
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
});

// Handle DELETE request to remove a profile image
deleteUserImageRouter.delete('/', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthorized',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        if (user.image) {
            // Extract public ID from the image URL
            const publicId = user.image.split('/').slice(-2, -1)[0] + '/' + user.image.split('/').pop().split('.')[0];

            // console.log('Deleting Cloudinary image with public ID:', publicId);

            // Delete image from Cloudinary
            const result = await cloudinary.v2.uploader.destroy(publicId, {
                resource_type: 'image', // Specify resource type
            });

            // console.log('Cloudinary delete result:', result);

            // Check if the deletion was successful
            if (result.result === 'ok') {
                // Remove image URL from user profile
                user.image = null;
                await user.save();
                return res.status(200).json({
                    status: 'success',
                    message: 'Profile image deleted successfully',
                });
            } else {
                return res.status(500).json({
                    status: 'failed',
                    message: 'Failed to delete image from Cloudinary',
                });
            }
        } else {
            return res.status(400).json({
                status: 'failed',
                message: 'No image to delete',
            });
        }
    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
});

export { updateUserImageRouter, deleteUserImageRouter };
