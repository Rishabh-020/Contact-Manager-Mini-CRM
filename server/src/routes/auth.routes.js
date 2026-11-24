const express = require("express");
const requireLogin = require("../middleware/auth");
const auth = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validateRegister, auth.register);
router.post("/login", validateLogin, auth.login);
router.get("/me", requireLogin, auth.me);

module.exports = router;
