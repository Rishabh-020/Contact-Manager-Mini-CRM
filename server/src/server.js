require("dotenv").config(); // loads server/.env first

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to server/.env");
  process.exit(1);
}

const app = require("./app");
const { setupDataFiles } = require("./config/db");
const { ensureAdminAccount } = require("./services/auth.service");

const PORT = process.env.PORT || 5000;

setupDataFiles();
ensureAdminAccount()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`),
    ),
  )
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
