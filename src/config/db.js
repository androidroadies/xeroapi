const mongoose = require('mongoose');
require('dotenv').config();

// Load database URI from environment variables (e.g., .env file)
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xero';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            dbName: "xero",
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Set up Mongoose event listeners
mongoose.connection.on('connected', () => {
    // db name from mongoose connection
    console.log(`Mongoose connected to DB: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});

// To close Mongoose connection when Node.js app terminates
const gracefulShutdown = (msg, callback) => {
    console.log(`Mongoose disconnected through ${msg}`);
    mongoose.connection.close();
};

// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});

// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown');
    process.exit(0);
});

module.exports = connectDB;
