const express = require("express");
const requireLogin = require("../middleware/auth");
const listController = require("../controllers/list.controller");
const {
  validateCreateList,
  validateUpdateList,
  validateListMembers,
} = require("../validators/list.validator");

const router = express.Router();

router.use(requireLogin);

router.get("/", listController.getAll);
router.get("/contact/:contactId", listController.getForContact);
router.get("/:id", listController.getById);
router.post("/", validateCreateList, listController.create);
router.put("/:id", validateUpdateList, listController.update);
router.delete("/:id", listController.remove);
router.post("/:id/contacts", validateListMembers, listController.addContacts);
router.delete("/:id/contacts/:contactId", listController.removeContact);

module.exports = router;
