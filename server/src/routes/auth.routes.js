const express = require("express");
const requireLogin = require("../middleware/auth");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", requireLogin, auth.me);

module.exports = router;
