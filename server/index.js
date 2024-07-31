import app from './app.js';
import connectDB from './db.js';
import './loadEnv.js'; // Load environment variables

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up at port ${PORT}`);
});