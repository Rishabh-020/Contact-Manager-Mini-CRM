const httpError = require("../utils/httpError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCreateContactBody(body = {}) {
  const firstName = String(body.firstName || "").trim();
  if (!firstName) {
    throw httpError(400, "First name is required.");
  }
  if (firstName.length > 100) {
    throw httpError(400, "First name cannot exceed 100 characters.");
  }

  const result = { firstName };

  if (body.lastName !== undefined) {
    const lastName = String(body.lastName || "").trim();
    if (lastName.length > 100) {
      throw httpError(400, "Last name cannot exceed 100 characters.");
    }
    result.lastName = lastName;
  }

  if (body.email !== undefined && body.email !== null && String(body.email).trim() !== "") {
    const email = String(body.email).trim();
    if (!EMAIL_REGEX.test(email)) {
      throw httpError(400, "Please enter a valid email address.");
    }
    result.email = email;
  } else if (body.email !== undefined) {
    result.email = "";
  }

  if (body.phone !== undefined && body.phone !== null && String(body.phone).trim() !== "") {
    const phone = String(body.phone).trim();
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, "");
    if (cleanPhone.length < 7 || !/^\d+$/.test(cleanPhone)) {
      throw httpError(400, "Please enter a valid phone number with at least 7 digits.");
    }
    result.phone = phone;
  } else if (body.phone !== undefined) {
    result.phone = "";
  }

  if (body.company !== undefined) {
    result.company = String(body.company || "").trim();
  }
  if (body.designation !== undefined) {
    result.designation = String(body.designation || "").trim();
  }
  if (body.notes !== undefined) {
    result.notes = String(body.notes || "").trim();
  }
  if (body.tags !== undefined) {
    result.tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t || "").trim()).filter(Boolean)
      : [];
  }
  if (body.isFavorite !== undefined) {
    result.isFavorite = Boolean(body.isFavorite);
  }
  if (body.followUpDate !== undefined) {
    if (!body.followUpDate) {
      result.followUpDate = null;
    } else {
      const parsed = new Date(body.followUpDate);
      if (isNaN(parsed.getTime())) {
        throw httpError(400, "Invalid follow-up date format.");
      }
      result.followUpDate = String(body.followUpDate).trim().split("T")[0];
    }
  }

  return result;
}

function validateUpdateContactBody(body = {}) {
  const result = {};

  if (body.firstName !== undefined) {
    const firstName = String(body.firstName || "").trim();
    if (!firstName) {
      throw httpError(400, "First name cannot be empty.");
    }
    if (firstName.length > 100) {
      throw httpError(400, "First name cannot exceed 100 characters.");
    }
    result.firstName = firstName;
  }

  if (body.lastName !== undefined) {
    const lastName = String(body.lastName || "").trim();
    if (lastName.length > 100) {
      throw httpError(400, "Last name cannot exceed 100 characters.");
    }
    result.lastName = lastName;
  }

  if (body.email !== undefined && body.email !== null && String(body.email).trim() !== "") {
    const email = String(body.email).trim();
    if (!EMAIL_REGEX.test(email)) {
      throw httpError(400, "Please enter a valid email address.");
    }
    result.email = email;
  } else if (body.email !== undefined) {
    result.email = "";
  }

  if (body.phone !== undefined && body.phone !== null && String(body.phone).trim() !== "") {
    const phone = String(body.phone).trim();
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, "");
    if (cleanPhone.length < 7 || !/^\d+$/.test(cleanPhone)) {
      throw httpError(400, "Please enter a valid phone number with at least 7 digits.");
    }
    result.phone = phone;
  } else if (body.phone !== undefined) {
    result.phone = "";
  }

  if (body.company !== undefined) {
    result.company = String(body.company || "").trim();
  }
  if (body.designation !== undefined) {
    result.designation = String(body.designation || "").trim();
  }
  if (body.notes !== undefined) {
    result.notes = String(body.notes || "").trim();
  }
  if (body.tags !== undefined) {
    result.tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t || "").trim()).filter(Boolean)
      : [];
  }
  if (body.isFavorite !== undefined) {
    result.isFavorite = Boolean(body.isFavorite);
  }
  if (body.followUpDate !== undefined) {
    if (!body.followUpDate) {
      result.followUpDate = null;
    } else {
      const parsed = new Date(body.followUpDate);
      if (isNaN(parsed.getTime())) {
        throw httpError(400, "Invalid follow-up date format.");
      }
      result.followUpDate = String(body.followUpDate).trim().split("T")[0];
    }
  }

  return result;
}

function validateContactQuery(query = {}) {
  const result = {};

  if (query.status !== undefined) {
    const status = String(query.status).toLowerCase();
    if (!["active", "deleted", "all"].includes(status)) {
      throw httpError(400, "Status query must be 'active', 'deleted', or 'all'.");
    }
    result.status = status;
  }

  if (query.page !== undefined) {
    const page = parseInt(query.page, 10);
    if (isNaN(page) || page < 1) {
      throw httpError(400, "Page must be a positive integer.");
    }
    result.page = page;
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
function validateCreateContact(req, res, next) {
  try {
    req.body = { ...req.body, ...validateCreateContactBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateUpdateContact(req, res, next) {
  try {
    req.body = { ...req.body, ...validateUpdateContactBody(req.body) };
    next();
  } catch (err) {
    next(err);
  }
}

function validateContactQueryMiddleware(req, res, next) {
  try {
    validateContactQuery(req.query);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateContactBody,
  validateUpdateContactBody,
  validateContactQuery,
  validateCreateContact,
  validateUpdateContact,
  validateContactQueryMiddleware,
};
