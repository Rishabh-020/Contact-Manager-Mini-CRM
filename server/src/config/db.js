let mongoose;
try {
  mongoose = require("mongoose");
} catch (err) {
  mongoose = null;
}

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!mongoose) {
    console.error("\n'mongoose' package is missing in server/node_modules!");
    console.error("Please open your terminal and run:\n   cd server\n   npm install\n");
    throw new Error("Mongoose package not installed. Run 'npm --prefix server install'");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("\nMONGODB_URI is not set in server/.env!");
    console.warn("Please add your MongoDB connection string in server/.env:");
    console.warn("MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/minicrm?retryWrites=true&w=majority\n");
    throw new Error("MONGODB_URI is missing in server/.env");
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = { connectDB };
