const jwt = require("jsonwebtoken");
const httpError = require("../utils/httpError");

// Checks the login token. Expects the header: Authorization: Bearer <token>
// If it is valid, req.user = { id, isAdmin } is set for the next function.
function requireLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, isAdmin: payload.isAdmin === true };
    next();
  } catch {
    next(httpError(401, "Please log in first."));
  }
}

module.exports = requireLogin;
