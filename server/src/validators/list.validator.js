const httpError = require("../utils/httpError");

const VALID_COLORS = [
  "blue",
  "indigo",
  "emerald",
  "amber",
  "rose",
  "purple",
  "cyan",
  "slate",
];

function validateCreateListBody(body = {}) {
  const name = String(body.name || "").trim();
  if (!name) {
    throw httpError(400, "List name is required.");
  }
  if (name.length > 100) {
    throw httpError(400, "List name cannot exceed 100 characters.");
  }

  const description = String(body.description || "").trim();
  if (description.length > 500) {
    throw httpError(400, "Description cannot exceed 500 characters.");
  }

  let color = "blue";
  if (body.color !== undefined) {
    const c = String(body.color).toLowerCase().trim();
    color = VALID_COLORS.includes(c) ? c : "blue";
  }

  const contactIds = Array.isArray(body.contactIds)
    ? body.contactIds.map((id) => String(id).trim()).filter(Boolean)
    : [];

  return {
    name,
    description,
    color,
    contactIds,
  };
}

function validateUpdateListBody(body = {}) {
  const result = {};

  if (body.name !== undefined) {
    const name = String(body.name || "").trim();
    if (!name) {
      throw httpError(400, "List name cannot be empty.");
    }
    if (name.length > 100) {
      throw httpError(400, "List name cannot exceed 100 characters.");
    }
    result.name = name;
  }

  if (body.description !== undefined) {
    const description = String(body.description || "").trim();
    if (description.length > 500) {
      throw httpError(400, "Description cannot exceed 500 characters.");
    }
    result.description = description;
  }

  if (body.color !== undefined) {
    const c = String(body.color).toLowerCase().trim();
    result.color = VALID_COLORS.includes(c) ? c : "blue";
  }

  return result;
}

function validateListMembersBody(body = {}) {
  if (!Array.isArray(body.contactIds) || body.contactIds.length === 0) {
    throw httpError(400, "contactIds must be a non-empty array of contact IDs.");
  }
  const contactIds = body.contactIds
    .map((id) => String(id).trim())
    .filter(Boolean);

  if (contactIds.length === 0) {
    throw httpError(400, "No valid contact IDs provided.");
  }

  return { contactIds };
}

// Express middleware
function validateCreateList(req, res, next) {
  try {
    req.body = { ...req.body, ...validateCreateListBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateUpdateList(req, res, next) {
  try {
    req.body = { ...req.body, ...validateUpdateListBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateListMembers(req, res, next) {
  try {
    req.body = { ...req.body, ...validateListMembersBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateListBody,
  validateUpdateListBody,
  validateListMembersBody,
  validateCreateList,
  validateUpdateList,
  validateListMembers,
};
