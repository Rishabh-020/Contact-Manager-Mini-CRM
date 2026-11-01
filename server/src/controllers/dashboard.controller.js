const dashboardService = require("../services/dashboard.service");
const wrap = require("../utils/wrap");

const getStats = wrap(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user.id);
  res.json({ success: true, data: { stats } });
});

module.exports = {
  getStats,
};
