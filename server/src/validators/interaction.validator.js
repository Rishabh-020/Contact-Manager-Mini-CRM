const httpError = require("../utils/httpError");

const VALID_TYPES = ["call", "email", "meeting", "note"];

function validateCreateInteractionBody(body = {}) {
  const contactId = String(body.contactId || "").trim();
  if (!contactId) {
    throw httpError(400, "Contact ID is required.");
  }

  const type = String(body.type || "").toLowerCase().trim();
  if (!VALID_TYPES.includes(type)) {
    throw httpError(
      400,
      `Valid interaction type (${VALID_TYPES.join(", ")}) is required.`
    );
  }

  const note = String(body.note || body.summary || body.description || "").trim();
  if (!note) {
    throw httpError(400, "Interaction note / remarks cannot be empty.");
  }
  if (note.length > 3000) {
    throw httpError(400, "Interaction note cannot exceed 3000 characters.");
  }

  const title = String(body.title || body.subject || "").trim();
  if (title.length > 200) {
    throw httpError(400, "Interaction title cannot exceed 200 characters.");
  }

  let date = new Date().toISOString();
  if (body.date) {
    const parsed = new Date(body.date);
    if (isNaN(parsed.getTime())) {
      throw httpError(400, "Invalid interaction date format.");
    }
    date = parsed.toISOString();
  }

  return {
    contactId,
    type,
    title,
    note,
    date,
  };
}

function validateInteractionQueryParams(query = {}) {
  const result = {};

  if (query.type !== undefined) {
    const type = String(query.type).toLowerCase().trim();
    if (![...VALID_TYPES, "all"].includes(type)) {
      throw httpError(
        400,
        `Type query must be one of: ${[...VALID_TYPES, "all"].join(", ")}`
      );
    }
    result.type = type;
  }

  if (query.limit !== undefined) {
    const limit = parseInt(query.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw httpError(400, "Limit must be an integer between 1 and 100.");
    }
    result.limit = limit;
  }

  return result;
}

// Express middleware
function validateCreateInteraction(req, res, next) {
  try {
    req.body = { ...req.body, ...validateCreateInteractionBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateInteractionQuery(req, res, next) {
  try {
    validateInteractionQueryParams(req.query);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateInteractionBody,
  validateInteractionQueryParams,
  validateCreateInteraction,
  validateInteractionQuery,
};
