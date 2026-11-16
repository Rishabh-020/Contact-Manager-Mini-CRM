const express = require("express");
const requireLogin = require("../middleware/auth");
const contact = require("../controllers/contact.controller");
const {
  validateCreateContact,
  validateUpdateContact,
  validateContactQueryMiddleware,
} = require("../validators/contact.validator");

const router = express.Router();

// Every contact route needs a logged-in user.
router.use(requireLogin);

// Contacts List & Export (must come before /:id)
router.get("/", validateContactQueryMiddleware, contact.list);
router.get("/export", contact.exportCSV);
router.post(
  "/import",
  express.text({ type: ["text/csv", "text/plain"], limit: "5mb" }),
  contact.importCSV
);
router.post("/demo/reset", contact.resetDemo);

// Contact CRUD by ID
router.get("/:id", contact.getById);
router.put("/:id", validateUpdateContact, contact.update);
router.delete("/:id", contact.remove);
router.patch("/:id/restore", contact.restore);
router.patch("/:id/favorite", contact.favorite);
router.delete("/:id/permanent", contact.permanent);

// Nested Interactions sub-resource on Contact per spec
router.get("/:id/interactions", contact.getInteractions);
router.post("/:id/interactions", contact.createInteraction);

module.exports = router;
