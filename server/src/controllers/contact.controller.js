const contactService = require('../services/contact.service');
const wrap = require('../utils/wrap');

const list = wrap((req, res) => {
  const data = contactService.listContacts(req.user.id, req.query);
  res.json({ success: true, data });
});

const create = wrap((req, res) => {
  const contact = contactService.createContact(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Contact created.', data: { contact } });
});

const update = wrap((req, res) => {
  const contact = contactService.updateContact(req.user.id, req.params.id, req.body);
  res.json({ success: true, message: 'Contact updated.', data: { contact } });
});

const remove = wrap((req, res) => {
  const contact = contactService.softDeleteContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Moved to deleted contacts.', data: { contact } });
});

const restore = wrap((req, res) => {
  const contact = contactService.restoreContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Contact restored.', data: { contact } });
});

const favorite = wrap((req, res) => {
  const contact = contactService.toggleFavorite(req.user.id, req.params.id);
  res.json({ success: true, data: { contact } });
});

const permanent = wrap((req, res) => {
  contactService.permanentDeleteContact(req.user.id, req.params.id);
  res.json({ success: true, message: 'Contact permanently deleted.' });
});

const resetDemo = wrap((req, res) => {
  const contacts = contactService.resetDemoContacts(req.user.id, req.user.isAdmin);
  res.json({ success: true, message: 'Demo contacts restored.', data: { contacts } });
});

module.exports = { list, create, update, remove, restore, favorite, permanent, resetDemo };