const authService = require("../services/auth.service");
const wrap = require("../utils/wrap");

const register = wrap(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, message: "Account created.", data });
});

const login = wrap(async (req, res) => {
  const data = await authService.login(req.body);
  res.json({ success: true, message: "Logged in.", data });
});

const me = wrap((req, res) => {
  const user = authService.getMe(req.user.id);
  res.json({ success: true, data: { user } });
});

module.exports = { register, login, me };
