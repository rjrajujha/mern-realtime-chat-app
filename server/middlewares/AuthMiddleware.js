import jwt from 'jsonwebtoken';

// import '../loadEnv.js'; // Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to use environment variables for your secret

export const verifyToken = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.jwt || req.body.jwt;

    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "No token provided, authentication required."
        });
    }

    try {
        // Verify token using secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user information to request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Token is invalid or expired
        return res.status(403).json({
            status: "failed",
            message: "Invalid or expired token."
        });
    }
};
