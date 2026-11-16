const contactService = require('../services/contact.service');
const interactionService = require('../services/interaction.service');
const httpError = require('../utils/httpError');
const wrap = require('../utils/wrap');

const list = wrap(async (req, res) => {
  const data = await contactService.listContacts(req.user.id, req.query);
  res.json({ success: true, data });
});

const getById = wrap(async (req, res) => {
  const contact = await contactService.getContactById(req.user.id, req.params.id);
  res.json({ success: true, data: { contact } });
});

const create = wrap(async (req, res) => {
  const contact = await contactService.createContact(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Contact created.', data: { contact } });
});

const update = wrap(async (req, res) => {
  const contact = await contactService.updateContact(req.user.id, req.params.id, req.body);
  res.json({ success: true, message: 'Contact updated.', data: { contact } });
});

const remove = wrap(async (req, res) => {
  const contact = await contactService.softDeleteContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Moved to deleted contacts.', data: { contact } });
});

const restore = wrap(async (req, res) => {
  const contact = await contactService.restoreContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Contact restored.', data: { contact } });
});

const favorite = wrap(async (req, res) => {
  const contact = await contactService.toggleFavorite(req.user.id, req.params.id);
  res.json({ success: true, data: { contact } });
});

const permanent = wrap(async (req, res) => {
  await contactService.permanentDeleteContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Contact permanently deleted.' });
});

const resetDemo = wrap(async (req, res) => {
  const contacts = await contactService.resetDemoContacts(req.user.id, req.user.isAdmin);
  res.json({ success: true, message: 'Demo contacts restored.', data: { contacts } });
});

// GET /api/contacts/export
const exportCSV = wrap(async (req, res) => {
  const csvData = await contactService.exportContactsCSV(req.user.id, req.query);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
  res.send(csvData);
});

// POST /api/contacts/import
const importCSV = wrap(async (req, res) => {
  let csvText = '';
  if (typeof req.body === 'string') {
    csvText = req.body;
  } else if (req.body && req.body.csv) {
    csvText = req.body.csv;
  } else {
    throw httpError(400, 'CSV data required. Send raw text/csv or JSON with { "csv": "..." }');
  }

  const result = await contactService.importContactsCSV(req.user.id, csvText);
  res.status(201).json({
    success: true,
    message: `Import completed: ${result.importedCount} imported, ${result.failedCount} skipped.`,
    data: result,
  });
});

// GET /api/contacts/:id/interactions
const getInteractions = wrap(async (req, res) => {
  const interactions = await interactionService.getInteractionsByContact(req.user.id, req.params.id);
  res.json({ success: true, data: { interactions } });
});

// POST /api/contacts/:id/interactions
const createInteraction = wrap(async (req, res) => {
  const interaction = await interactionService.createInteraction(req.user.id, {
    ...req.body,
    contactId: req.params.id,
  });
  res.status(201).json({
    success: true,
    message: 'Interaction logged.',
    data: { interaction },
  });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  restore,
  favorite,
  permanent,
  resetDemo,
  exportCSV,
  importCSV,
  getInteractions,
  createInteraction,
};
