const express = require("express");
const requireLogin = require("../middleware/auth");
const dashboardController = require("../controllers/dashboard.controller");
const { validateDashboardQuery } = require("../validators/dashboard.validator");

const router = express.Router();

router.use(requireLogin);

router.get("/stats", validateDashboardQuery, dashboardController.getStats);

module.exports = router;
