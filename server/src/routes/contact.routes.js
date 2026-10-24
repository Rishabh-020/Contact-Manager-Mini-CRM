const express = require("express");
const requireLogin = require("../middleware/auth");
const contact = require("../controllers/contact.controller");

const router = express.Router();

// Every contact route needs a logged-in user.
router.use(requireLogin);

router.get("/", contact.list);
router.post("/", contact.create);
router.post("/demo/reset", contact.resetDemo);
router.put("/:id", contact.update);
router.delete("/:id", contact.remove);
router.patch("/:id/restore", contact.restore);
router.patch("/:id/favorite", contact.favorite);
router.delete("/:id/permanent", contact.permanent);

module.exports = router;
