const httpError = require("../utils/httpError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterBody(body = {}) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!name) {
    throw httpError(400, "Name is required.");
  }
  if (name.length < 2 || name.length > 100) {
    throw httpError(400, "Name must be between 2 and 100 characters.");
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    throw httpError(400, "Please enter a valid email address.");
  }
  if (!password || password.length < 6) {
    throw httpError(400, "Password must be at least 6 characters.");
  }

  return { name, email, password };
}

function validateLoginBody(body = {}) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !EMAIL_REGEX.test(email)) {
    throw httpError(400, "Please enter a valid email address.");
  }
  if (!password) {
    throw httpError(400, "Password is required.");
  }

  return { email, password };
}

// Express middleware
function validateRegister(req, res, next) {
  try {
    req.body = { ...req.body, ...validateRegisterBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateLogin(req, res, next) {
  try {
    req.body = { ...req.body, ...validateLoginBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  validateRegister,
  validateLogin,
};
