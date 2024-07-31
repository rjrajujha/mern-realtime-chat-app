import express from 'express';
import cookieParser from 'cookie-parser';

// Initialize Express
const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Your frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Define routes
app.post('/init', (req, res) => {
    res.json({
        status: "Connected",
        message: "Backend Connected"
    });
});

// Import routes from AuthController
import authController from './controllers/AuthController.js'; // Adjust the path if needed

app.use('/api', authController); // Use the AuthController for all API routes

app.use("/uploads/profiles", express.static("uploades/profiles"));

// Redirect all other routes
app.get('/*', (req, res) => {
    res.redirect(301, "https://github.com/rjrajujha");
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

export default app;