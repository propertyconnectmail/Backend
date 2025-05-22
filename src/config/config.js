// src/config/config.js

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
    dbUrl: process.env.MONGODB_URI || 'mongodb+srv://propertyconnectmail:Lf4KmAYu4oaL83Ok@property-connect-backen.kzqiurs.mongodb.net/?retryWrites=true&w=majority&appName=Property-Connect-Backend',
    port: process.env.PORT || 5000,
    env: process.env.APP_ENV || 'development',
    appName: process.env.APP_NAME || 'Property Connect',
    appUrl: process.env.APP_URL || 'http://localhost',
    logDir: process.env.LOG_DIR || 'logs/',
    jwtSecret: process.env.JWT_SECRET || 'yoursecretkey',  // future proof if you add JWT
    awsBucketName: process.env.AWS_BUCKET_NAME || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsRegion: process.env.AWS_REGION || '',
    // Add any other config you might need later (Stripe keys, Zoom API keys, etc.)
};

module.exports = config;
