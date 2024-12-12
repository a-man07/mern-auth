import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Log connection events for debugging
        mongoose.connection.on('connected', () => console.log("Database connected"));
        mongoose.connection.on('error', (error) => console.error("Database connection error:", error));
        
        // Use `dbName` option instead of appending to the URI
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'mern-auth', // Specify the database name here
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Failed to connect to database:", error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};

export default connectDB;
