const path = require("path");

// Safely load environment variables from server/.env regardless of where node is launched
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config(); // fallback to current working directory if present

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to server/.env");
  process.exit(1);
}

if (!process.env.CLIENT_ORIGIN) {
  console.log("CLIENT_ORIGIN(Frontend) url is missing. Add it to server/.env");
  process.exit(1);
}

const app = require("./app");
const { connectDB } = require("./config/db");
const { ensureAdminAccount } = require("./services/auth.service");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureAdminAccount();
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
