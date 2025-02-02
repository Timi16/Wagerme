const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure this path points to your User model

// MongoDB Atlas Connection
const MONGO_URI = "mongodb+srv://olowutimilehin3:wW4aIxJyoq5EcQqx@cluster0.qipl4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Function to Promote User
async function promoteToAdmin(email) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found!');
            return;
        }

        user.isAdmin = true;
        await user.save();

        console.log(`✅ User (${user.email}) has been promoted to Admin.`);
        process.exit(0); // Exit the script
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        process.exit(1);
    }
}

// Example: Promote the user with this email
promoteToAdmin('timmy@example.com');
