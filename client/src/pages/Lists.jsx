import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Users,
  Tag,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Search,
  UserPlus
} from 'lucide-react';
import { useContacts } from '../App.jsx';
import * as listApi from '../api/listApi.js';

export default function Lists() {
  const { activeContacts, showToast } = useContacts();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('custom'); // 'custom' or 'tags'
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  // Create / Edit List Modal
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [listForm, setListForm] = useState({
    name: '',
    description: '',
    color: 'blue',
  });

  // Manage Members Modal
  const [activeMemberList, setActiveMemberList] = useState(null);
  const [listDetails, setListDetails] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedContactIdsToAdd, setSelectedContactIdsToAdd] = useState([]);

  // Load custom lists from server
  const loadLists = async () => {
    try {
      setLoadingLists(true);
      const data = await listApi.getAllLists();
      setLists(data);
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  // Tag Segments calculation
  const tagGroups = useMemo(() => {
    const map = {};
    activeContacts.forEach((contact) => {
      (contact.tags || []).forEach((t) => {
        if (!map[t]) map[t] = [];
        map[t].push(contact);
      });
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [activeContacts]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingList(null);
    setListForm({ name: '', description: '', color: 'blue' });
    setShowListModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (list) => {
    setEditingList(list);
    setListForm({
      name: list.name,
      description: list.description || '',
      color: list.color || 'blue',
    });
    setShowListModal(true);
  };

  // Save List (Create or Update)
  const handleSaveList = async (e) => {
    e.preventDefault();
    if (!listForm.name.trim()) {
      showToast('Please enter a list name.', 'warning');
      return;
    }

    try {
      if (editingList) {
        await listApi.updateList(editingList.id, listForm);
        showToast('List updated successfully!');
      } else {
        await listApi.createList(listForm);
        showToast('List created successfully!');
      }
      setShowListModal(false);
      loadLists();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Delete List
  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list? (Contacts will not be deleted)')) {
      return;
    }
    try {
      await listApi.deleteList(listId);
      showToast('List deleted successfully.');
      loadLists();
      if (activeMemberList?.id === listId) {
        setActiveMemberList(null);
      }
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Open Members View
  const handleOpenMembers = async (list) => {
    try {
      setActiveMemberList(list);
      setLoadingMembers(true);
      const detail = await listApi.getListById(list.id);
      setListDetails(detail);
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setLoadingMembers(false);
    }
  };

  // Remove contact from list
  const handleRemoveContactFromList = async (contactId) => {
    if (!activeMemberList) return;
    try {
      await listApi.removeContactFromList(activeMemberList.id, contactId);
      showToast('Contact removed from list.');
      const detail = await listApi.getListById(activeMemberList.id);
      setListDetails(detail);
      loadLists();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Add selected contacts to list
  const handleAddContactsToList = async () => {
    if (!activeMemberList || selectedContactIdsToAdd.length === 0) return;
    try {
      await listApi.addContactsToList(activeMemberList.id, selectedContactIdsToAdd);
      showToast(`Added ${selectedContactIdsToAdd.length} contacts to list!`);
      setSelectedContactIdsToAdd([]);
      setShowAddMembersModal(false);
      const detail = await listApi.getListById(activeMemberList.id);
      setListDetails(detail);
      loadLists();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'purple':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          hoverBorder: 'hover:border-purple-300',
        };
      case 'emerald':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          hoverBorder: 'hover:border-emerald-300',
        };
      case 'amber':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          hoverBorder: 'hover:border-amber-300',
        };
      case 'rose':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          hoverBorder: 'hover:border-rose-300',
        };
      default:
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          hoverBorder: 'hover:border-blue-300',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Lists & Segments
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
              {activeTab === 'custom' ? `${lists.length} Custom Lists` : `${tagGroups.length} Tag Segments`}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Group contacts into focused marketing lists, client tiers, and dynamic CRM segments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'custom' ? (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New List</span>
            </button>
          ) : (
            <Link
              to="/contacts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Contact</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'custom'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Custom Lists</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {lists.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tags')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tags'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Automated Tag Segments</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {tagGroups.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Custom Lists */}
      {activeTab === 'custom' && (
        <>
          {loadingLists ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
              <p className="text-sm text-slate-400">Loading custom lists...</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Custom Lists Yet</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Create custom lists like "VIP Clients", "Enterprise Prospects", or "Conference 2026" to group contacts.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create First List</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lists.map((list) => {
                const colors = getColorClasses(list.color);
                return (
                  <div
                    key={list.id}
                    className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs ${colors.hoverBorder} hover:shadow-md transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {list.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(list)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                            title="Edit list"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteList(list.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mb-4">
                        {list.description || 'No description provided.'}
                      </p>

                      {/* Member Avatars preview */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Users className="w-3.5 h-3.5" />
                          <span>{list.contactsCount || 0} members</span>
                        </span>

                        {list.memberPreviews && list.memberPreviews.length > 0 && (
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {list.memberPreviews.slice(0, 3).map((m, idx) => (
                              <div
                                key={idx}
                                title={m.name}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center"
                              >
                                {m.name.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {list.contactsCount > 3 && (
                              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                                +{list.contactsCount - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenMembers(list)}
                        className="flex-1 py-2 text-center text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors border border-slate-200/80"
                      >
                        Manage Members
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/contacts?listId=${list.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors"
                        title="View contacts in this list"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Automated Tag Segments */}
      {activeTab === 'tags' && (
        <>
          {tagGroups.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Tag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Tag Segments Yet</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Assign tags like "Lead", "Enterprise", or "Customer" to contacts to automatically group them here.
              </p>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>View Contacts</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tagGroups.map(([tagName, contactsInTag]) => (
                <div
                  key={tagName}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200/60 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{contactsInTag.length}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                      {tagName}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Segment generated automatically from CRM contact tags.
                    </p>
                  </div>

                  <Link
                    to={`/contacts?tag=${encodeURIComponent(tagName)}`}
                    className="inline-flex items-center justify-between w-full p-2.5 text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl transition-colors"
                  >
                    <span>View All {contactsInTag.length} Contacts</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL: Create / Edit Custom List */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span>{editingList ? 'Edit List' : 'Create Custom List'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowListModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveList} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  List Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Accounts, Conference 2026"
                  value={listForm.name}
                  onChange={(e) => setListForm({ ...listForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="What is this list used for?"
                  value={listForm.description}
                  onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
                    { id: 'purple', label: 'Purple', color: 'bg-purple-500' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                    { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                    { id: 'rose', label: 'Rose', color: 'bg-rose-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setListForm({ ...listForm, color: c.id })}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        c.color
                      } ${listForm.color === c.id ? 'ring-3 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'}`}
                      title={c.label}
                    >
                      {listForm.color === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  {editingList ? 'Save Changes' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View / Manage List Members */}
      {activeMemberList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{activeMemberList.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {listDetails?.contacts?.length || 0} contacts in this list
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMemberList(null);
                  setListDetails(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedContactIdsToAdd([]);
                  setShowAddMembersModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Contacts</span>
              </button>
            </div>

            {loadingMembers ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading members...</p>
            ) : !listDetails?.contacts || listDetails.contacts.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-600">This list has no contacts yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContactIdsToAdd([]);
                    setShowAddMembersModal(true);
                  }}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Click here to add contacts →
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {listDetails.contacts
                  .filter((c) => {
                    if (!memberSearch.trim()) return true;
                    const q = memberSearch.toLowerCase();
                    return (
                      `${c.firstName} ${c.lastName || ''}`.toLowerCase().includes(q) ||
                      (c.email || '').toLowerCase().includes(q) ||
                      (c.company || '').toLowerCase().includes(q)
                    );
                  })
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {c.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/contacts/${c.id}`}
                            className="text-xs font-semibold text-slate-900 hover:text-blue-600 truncate block"
                          >
                            {c.firstName} {c.lastName}
                          </Link>
                          <p className="text-[11px] text-slate-400 truncate">
                            {c.email || c.company || 'No email'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveContactFromList(c.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove from this list"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActiveMemberList(null);
                  setListDetails(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Select and Add Contacts to Active List */}
      {showAddMembersModal && activeMemberList && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Add Contacts to {activeMemberList.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMembersModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select contacts from your CRM to add to this list:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeContacts.map((c) => {
                const isAlreadyInList = (listDetails?.contactIds || []).includes(c.id);
                const isSelected = selectedContactIdsToAdd.includes(c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (isAlreadyInList) return;
                      setSelectedContactIdsToAdd((prev) =>
                        isSelected ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                      );
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isAlreadyInList
                        ? 'bg-slate-50 opacity-50 cursor-not-allowed border-slate-200'
                        : isSelected
                        ? 'bg-blue-50/70 border-blue-400 cursor-pointer'
                        : 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isAlreadyInList
                            ? 'bg-slate-300 border-slate-300 text-white'
                            : isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {(isAlreadyInList || isSelected) && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {c.company || c.email || 'No organization'}
                        </p>
                      </div>
                    </div>

                    {isAlreadyInList && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        Already in list
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {selectedContactIdsToAdd.length} selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMembersModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedContactIdsToAdd.length === 0}
                  onClick={handleAddContactsToList}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl shadow-xs"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
