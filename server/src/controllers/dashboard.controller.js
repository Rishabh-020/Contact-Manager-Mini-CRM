const dashboardService = require("../services/dashboard.service");
const wrap = require("../utils/wrap");

const getStats = wrap((req, res) => {
  const stats = dashboardService.getDashboardStats(req.user.id);
  res.json({ success: true, data: { stats } });
});

module.exports = {
  getStats,
};
