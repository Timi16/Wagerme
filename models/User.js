const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    walletBalance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }, // Admin role
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
