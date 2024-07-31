import mongoose from "mongoose";

// Import the loadEnv module to configure dotenv
import './loadEnv.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
