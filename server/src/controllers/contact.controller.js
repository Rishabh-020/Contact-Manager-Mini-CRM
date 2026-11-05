const contactService = require('../services/contact.service');
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
};
