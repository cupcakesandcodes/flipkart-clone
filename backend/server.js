const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config();
const connectDatabase = require('./config/database');
const app = require('./app');
const cors = require('cors');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// ----- Uncaught Exception Handling -----
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// ----- Connect to Database -----
connectDatabase();

// ----- Cloudinary Configuration -----
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----- Enable CORS for development -----
if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}

// ----- Frontend Deployment -----
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend-vite/dist');

    // Serve static files from Vite build
    app.use(express.static(frontendPath));

    // All unmatched routes serve index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    // Development test route
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

// ----- Start Server -----
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ----- Unhandled Promise Rejection -----
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
