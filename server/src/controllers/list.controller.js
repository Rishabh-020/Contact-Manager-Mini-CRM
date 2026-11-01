const listService = require("../services/list.service");
const wrap = require("../utils/wrap");

const getAll = wrap((req, res) => {
  const lists = listService.getAllLists(req.user.id);
  res.json({ success: true, data: { lists } });
});

const getById = wrap((req, res) => {
  const list = listService.getListById(req.user.id, req.params.id);
  res.json({ success: true, data: { list } });
});

const create = wrap((req, res) => {
  const list = listService.createList(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: "List created successfully.",
    data: { list },
  });
});

const update = wrap((req, res) => {
  const list = listService.updateList(req.user.id, req.params.id, req.body);
  res.json({
    success: true,
    message: "List updated successfully.",
    data: { list },
  });
});

const remove = wrap((req, res) => {
  const list = listService.deleteList(req.user.id, req.params.id);
  res.json({
    success: true,
    message: "List deleted.",
    data: { list },
  });
});

const addContacts = wrap((req, res) => {
  const list = listService.addContactsToList(
    req.user.id,
    req.params.id,
    req.body.contactIds
  );
  res.json({
    success: true,
    message: "Contacts added to list.",
    data: { list },
  });
});

const removeContact = wrap((req, res) => {
  const list = listService.removeContactFromList(
    req.user.id,
    req.params.id,
    req.params.contactId
  );
  res.json({
    success: true,
    message: "Contact removed from list.",
    data: { list },
  });
});

const getForContact = wrap((req, res) => {
  const lists = listService.getListsForContact(req.user.id, req.params.contactId);
  res.json({ success: true, data: { lists } });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addContacts,
  removeContact,
  getForContact,
};
