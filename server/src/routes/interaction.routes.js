const express = require("express");
const requireLogin = require("../middleware/auth");
const interactionController = require("../controllers/interaction.controller");
const {
  validateCreateInteraction,
  validateInteractionQuery,
} = require("../validators/interaction.validator");

const router = express.Router();

router.use(requireLogin);

router.get("/", validateInteractionQuery, interactionController.getAll);
router.get("/recent", validateInteractionQuery, interactionController.getRecent);
router.get("/contact/:contactId", interactionController.getByContact);
router.post("/", validateCreateInteraction, interactionController.create);
router.delete("/:id", interactionController.remove);

module.exports = router;
