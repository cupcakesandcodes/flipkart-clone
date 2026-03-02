const mongoose = require('mongoose');

const connectDatabase = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDatabase;
