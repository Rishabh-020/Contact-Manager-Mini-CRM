const express = require("express");
const requireLogin = require("../middleware/auth");
const followUpController = require("../controllers/followUp.controller");
const {
  validateCreateFollowUp,
  validateUpdateFollowUp,
  validateFollowUpQuery,
} = require("../validators/followUp.validator");

const router = express.Router();

router.use(requireLogin);

router.get("/", validateFollowUpQuery, followUpController.getAll);
router.post("/", validateCreateFollowUp, followUpController.create);
router.put("/:id", validateUpdateFollowUp, followUpController.update);
router.patch("/:id/status", followUpController.toggleStatus);
router.delete("/:id", followUpController.remove);

module.exports = router;
