const httpError = require("../utils/httpError");

const VALID_TIME_RANGES = ["7d", "30d", "90d", "thisMonth", "all"];

function validateDashboardQueryParams(query = {}) {
  const result = {};

  if (query.timeRange !== undefined) {
    const range = String(query.timeRange).trim();
    if (!VALID_TIME_RANGES.includes(range)) {
      throw httpError(
        400,
        `Invalid timeRange. Allowed values: ${VALID_TIME_RANGES.join(", ")}`
      );
    }
    result.timeRange = range;
  } else {
    result.timeRange = "all";
  }

  if (query.limit !== undefined) {
    const limit = parseInt(query.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > 50) {
      throw httpError(400, "Limit must be an integer between 1 and 50.");
    }
    result.limit = limit;
  }

  return result;
}

// Express middleware
function validateDashboardQuery(req, res, next) {
  try {
    req.query = { ...req.query, ...validateDashboardQueryParams(req.query) };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateDashboardQueryParams,
  validateDashboardQuery,
};
