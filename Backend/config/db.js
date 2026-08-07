const mongoose = require("mongoose");

const connectDB = async () => {
    // Guard: catch the common mistake of leaving the placeholder password
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("YOUR_PASSWORD_HERE") || process.env.MONGO_URI.includes("<db_password>")) {
        console.error("❌ MONGO_URI is missing or still has a placeholder password.");
        console.error("   Open Backend/.env and replace YOUR_PASSWORD_HERE with your actual MongoDB Atlas password.");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);

        // Provide helpful hints for common Atlas errors
        if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
            console.error("   → Check that your IP address is whitelisted in MongoDB Atlas (Network Access).");
        }
        if (error.message.includes("Authentication failed")) {
            console.error("   → Your username or password is incorrect. Check your MONGO_URI in .env.");
        }

        process.exit(1);
    }
};

module.exports = connectDB;