const httpError = require("../utils/httpError");

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["pending", "completed"];

function validateCreateFollowUpBody(body = {}) {
  const contactId = String(body.contactId || "").trim();
  if (!contactId) {
    throw httpError(400, "Contact ID is required.");
  }

  const description = String(body.description || body.title || "").trim();
  if (!description) {
    throw httpError(400, "Follow-up description is required.");
  }
  if (description.length > 500) {
    throw httpError(400, "Description cannot exceed 500 characters.");
  }

  if (!body.dueDate) {
    throw httpError(400, "Follow-up due date is required.");
  }
  const parsedDate = new Date(body.dueDate);
  if (isNaN(parsedDate.getTime())) {
    throw httpError(400, "Invalid due date format.");
  }
  const dueDate = String(body.dueDate).trim().split("T")[0];

  let priority = "medium";
  if (body.priority !== undefined) {
    const prio = String(body.priority).toLowerCase().trim();
    if (!VALID_PRIORITIES.includes(prio)) {
      throw httpError(400, `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
    }
    priority = prio;
  }

  return {
    contactId,
    description,
    dueDate,
    priority,
  };
}

function validateUpdateFollowUpBody(body = {}) {
  const result = {};

  if (body.description !== undefined || body.title !== undefined) {
    const description = String(body.description || body.title || "").trim();
    if (!description) {
      throw httpError(400, "Description cannot be empty.");
    }
    if (description.length > 500) {
      throw httpError(400, "Description cannot exceed 500 characters.");
    }
    result.description = description;
  }

  if (body.dueDate !== undefined) {
    const parsedDate = new Date(body.dueDate);
    if (isNaN(parsedDate.getTime())) {
      throw httpError(400, "Invalid due date format.");
    }
    result.dueDate = String(body.dueDate).trim().split("T")[0];
  }

  if (body.priority !== undefined) {
    const prio = String(body.priority).toLowerCase().trim();
    if (!VALID_PRIORITIES.includes(prio)) {
      throw httpError(400, `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
    }
    result.priority = prio;
  }

  if (body.status !== undefined) {
    const status = String(body.status).toLowerCase().trim();
    if (!VALID_STATUSES.includes(status)) {
      throw httpError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    result.status = status;
  }

  return result;
}

function validateFollowUpQueryParams(query = {}) {
  const result = {};

  if (query.status !== undefined) {
    const status = String(query.status).toLowerCase().trim();
    if (![...VALID_STATUSES, "all"].includes(status)) {
      throw httpError(400, "Status query must be 'pending', 'completed', or 'all'.");
    }
    result.status = status;
  }

  if (query.priority !== undefined) {
    const priority = String(query.priority).toLowerCase().trim();
    if (!VALID_PRIORITIES.includes(priority)) {
      throw httpError(400, `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
    }
    result.priority = priority;
  }

  return result;
}

// Express middleware
function validateCreateFollowUp(req, res, next) {
  try {
    req.body = { ...req.body, ...validateCreateFollowUpBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateUpdateFollowUp(req, res, next) {
  try {
    req.body = { ...req.body, ...validateUpdateFollowUpBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateFollowUpQuery(req, res, next) {
  try {
    validateFollowUpQueryParams(req.query);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateFollowUpBody,
  validateUpdateFollowUpBody,
  validateFollowUpQueryParams,
  validateCreateFollowUp,
  validateUpdateFollowUp,
  validateFollowUpQuery,
};
