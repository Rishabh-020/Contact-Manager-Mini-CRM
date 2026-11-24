const interactionService = require("../services/interaction.service");
const wrap = require("../utils/wrap");

const getAll = wrap(async (req, res) => {
  const limit = Math.min(100, Number(req.query.limit) || 50);
  const interactions = await interactionService.getRecentInteractions(req.user.id, limit);
  res.json({ success: true, data: { interactions } });
});

const getByContact = wrap(async (req, res) => {
  const interactions = await interactionService.getInteractionsByContact(req.user.id, req.params.contactId);
  res.json({ success: true, data: { interactions } });
});

const getRecent = wrap(async (req, res) => {
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const interactions = await interactionService.getRecentInteractions(req.user.id, limit);
  res.json({ success: true, data: { interactions } });
});

const create = wrap(async (req, res) => {
  const interaction = await interactionService.createInteraction(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: "Interaction recorded successfully.",
    data: { interaction },
  });
});

const remove = wrap(async (req, res) => {
  const removed = await interactionService.deleteInteraction(req.user.id, req.params.id);
  res.json({
    success: true,
    message: "Interaction removed.",
    data: { interaction: removed },
  });
});

module.exports = {
  getAll,
  getByContact,
  getRecent,
  create,
  remove,
};
