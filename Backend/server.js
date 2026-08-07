const dns = require("dns");

// Force Node.js to prefer IPv4 over IPv6 when resolving addresses
dns.setDefaultResultOrder("ipv4first");

// Override system DNS with Google Public DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bugRoutes = require("./routes/bugRoutes");

dotenv.config();          // Load variables from .env

connectDB();              // Connect to MongoDB

const app = express();    // Create Express application

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bugs", bugRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("Bug Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});