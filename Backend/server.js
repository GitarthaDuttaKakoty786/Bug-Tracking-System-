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

// ── CORS ──────────────────────────────────────────────────────────────────
// Reads ALLOWED_ORIGINS from env (comma-separated list of allowed URLs).
// Always allows: localhost (any port) and file:// pages (null origin).
// Set in Render dashboard: ALLOWED_ORIGINS=https://your-app.vercel.app
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, ""))
    : [];

const corsOptions = {
    origin: function (origin, callback) {
        // No origin = server-to-server or curl — allow
        if (!origin) return callback(null, true);
        // file:// pages send origin "null" as a string
        if (origin === "null") return callback(null, true);
        // Any localhost port (dev server)
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
        // Strip trailing slash from incoming origin before comparing
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
        // Log blocked origin to Render logs for easier debugging
        console.warn(`CORS blocked: "${origin}" | Allowed: ${allowedOrigins.join(", ") || "none"}`);
        callback(null, false);   // Return false (not an error) so preflight gets 204 not 500
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);
// ──────────────────────────────────────────────────────────────────────────

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