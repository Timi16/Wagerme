const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');  // Add this line

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);  // Add this line

app.get("/", (req, res) => {
    res.send("WagerMe API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
