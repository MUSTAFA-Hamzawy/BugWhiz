const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB");
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        return false;
    }
}

module.exports = connectDB;
