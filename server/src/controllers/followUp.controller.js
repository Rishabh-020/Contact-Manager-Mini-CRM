const followUpService = require("../services/followUp.service");
const wrap = require("../utils/wrap");

const getAll = wrap((req, res) => {
  const followUps = followUpService.getAllFollowUps(req.user.id, req.query);
  res.json({ success: true, data: { followUps } });
});

const create = wrap((req, res) => {
  const followUp = followUpService.createFollowUp(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: "Follow-up task scheduled.",
    data: { followUp },
  });
});

const update = wrap((req, res) => {
  const followUp = followUpService.updateFollowUp(req.user.id, req.params.id, req.body);
  res.json({
    success: true,
    message: "Follow-up task updated.",
    data: { followUp },
  });
});

const toggleStatus = wrap((req, res) => {
  const followUp = followUpService.toggleFollowUpStatus(req.user.id, req.params.id);
  res.json({
    success: true,
    message: followUp.status === "completed" ? "Marked as completed." : "Reopened task.",
    data: { followUp },
  });
});

const remove = wrap((req, res) => {
  const removed = followUpService.deleteFollowUp(req.user.id, req.params.id);
  res.json({
    success: true,
    message: "Follow-up task deleted.",
    data: { followUp: removed },
  });
});

module.exports = {
  getAll,
  create,
  update,
  toggleStatus,
  remove,
};
