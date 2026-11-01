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

router.get("/", validateContactQueryMiddleware, contact.list);
router.post("/", validateCreateContact, contact.create);
router.post("/demo/reset", contact.resetDemo);
router.get("/:id", contact.getById);
router.put("/:id", validateUpdateContact, contact.update);
router.delete("/:id", contact.remove);
router.patch("/:id/restore", contact.restore);
router.patch("/:id/favorite", contact.favorite);
router.delete("/:id/permanent", contact.permanent);

module.exports = router;
