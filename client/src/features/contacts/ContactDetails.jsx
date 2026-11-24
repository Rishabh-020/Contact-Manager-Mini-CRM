import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Clock,
  Star,
  Edit2,
  Trash2,
  Tag,
  FileText,
  User,
  AlertTriangle,
  Copy,
  Plus,
  MessageSquare,
  Users,
  CheckSquare,
  FolderOpen,
  CalendarPlus,
  X,
  History,
  Check
} from 'lucide-react';
import { useContacts } from '../../App.jsx';
import * as contactApi from '../../api/contactApi.js';
import * as interactionApi from '../../api/interactionApi.js';
import * as listApi from '../../api/listApi.js';
import * as followUpApi from '../../api/followUpApi.js';

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    contacts,
    deleteContact,
    toggleFavorite,
    showToast,
    loadContacts
  } = useContacts();

  const [contact, setContact] = useState(() => contacts.find((c) => c.id === id) || null);
  const [loadingContact, setLoadingContact] = useState(!contact);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Interactions State
  const [interactions, setInteractions] = useState([]);
  const [loadingInteractions, setLoadingInteractions] = useState(true);
  const [showAddInteractionModal, setShowAddInteractionModal] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'call',
    title: '',
    note: '',
    date: new Date().toISOString().slice(0, 16),
  });

  // Lists State
  const [allLists, setAllLists] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [showManageListsModal, setShowManageListsModal] = useState(false);

  // Follow-ups State
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);
  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    description: '',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
  });

  // Sync / Fetch Contact
  useEffect(() => {
    const existing = contacts.find((c) => c.id === id);
    if (existing) {
      setContact(existing);
      setLoadingContact(false);
    } else if (id) {
      setLoadingContact(true);
      contactApi
        .getContact(id)
        .then((fetched) => setContact(fetched))
        .catch(() => setContact(null))
        .finally(() => setLoadingContact(false));
    }
  }, [id, contacts]);

  // Load Contact Related Data
  const loadRelatedData = async () => {
    if (!id) return;
    try {
      setLoadingInteractions(true);
      setLoadingFollowUps(true);

      const [interRes, allListsRes, contactListsRes, followUpsRes] = await Promise.all([
        interactionApi.getContactInteractions(id).catch(() => []),
        listApi.getAllLists().catch(() => []),
        listApi.getListsForContact(id).catch(() => []),
        followUpApi.getAllFollowUps({ contactId: id }).catch(() => []),
      ]);

      setInteractions(interRes);
      setAllLists(allListsRes);
      setContactLists(contactListsRes);
      setFollowUps(followUpsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInteractions(false);
      setLoadingFollowUps(false);
    }
  };

  useEffect(() => {
    loadRelatedData();
  }, [id]);

  if (loadingContact) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-12 text-sm text-slate-500">
        Loading contact details...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Contact Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The requested contact record does not exist or has been permanently removed.
        </p>
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteContact(contact.id);
    setShowDeleteModal(false);
    navigate('/contacts');
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'C';
  };

  // Interaction handlers
  const handleCreateInteraction = async (e) => {
    e.preventDefault();
    if (!interactionForm.note.trim()) {
      showToast('Please enter interaction notes.', 'warning');
      return;
    }
    try {
      await interactionApi.createInteraction({
        contactId: contact.id,
        ...interactionForm,
      });
      showToast('Activity logged successfully!');
      setShowAddInteractionModal(false);
      setInteractionForm({
        type: 'call',
        title: '',
        note: '',
        date: new Date().toISOString().slice(0, 16),
      });
      const updated = await interactionApi.getContactInteractions(contact.id);
      setInteractions(updated);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleDeleteInteraction = async (interId) => {
    try {
      await interactionApi.deleteInteraction(interId);
      showToast('Activity deleted.', 'info');
      setInteractions((prev) => prev.filter((i) => i.id !== interId));
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Follow-up handlers
  const handleCreateFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpForm.description.trim() || !followUpForm.dueDate) {
      showToast('Please fill in both description and due date.', 'warning');
      return;
    }
    try {
      await followUpApi.createFollowUp({
        contactId: contact.id,
        ...followUpForm,
      });
      showToast('Follow-up scheduled successfully!');
      setShowAddFollowUpModal(false);
      setFollowUpForm({
        description: '',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        priority: 'medium',
      });
      const updated = await followUpApi.getAllFollowUps({ contactId: contact.id });
      setFollowUps(updated);
      loadContacts();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleToggleFollowUp = async (fId) => {
    try {
      const updatedItem = await followUpApi.toggleFollowUpStatus(fId);
      setFollowUps((prev) =>
        prev.map((f) => (f.id === fId ? updatedItem : f))
      );
      showToast(
        updatedItem.status === 'completed'
          ? 'Task marked as completed!'
          : 'Task reopened.'
      );
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleDeleteFollowUp = async (fId) => {
    try {
      await followUpApi.deleteFollowUp(fId);
      showToast('Follow-up task deleted.', 'info');
      setFollowUps((prev) => prev.filter((f) => f.id !== fId));
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // List membership toggle
  const handleToggleListMembership = async (listId, isCurrentlyMember) => {
    try {
      if (isCurrentlyMember) {
        await listApi.removeContactFromList(listId, contact.id);
        setContactLists((prev) => prev.filter((l) => l.id !== listId));
        showToast('Removed from list.', 'info');
      } else {
        await listApi.addContactsToList(listId, [contact.id]);
        const matched = allLists.find((l) => l.id === listId);
        if (matched) {
          setContactLists((prev) => [...prev, { id: matched.id, name: matched.name, color: matched.color }]);
        }
        showToast('Added to list!');
      }
      const updatedAll = await listApi.getAllLists();
      setAllLists(updatedAll);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'meeting':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  const getInteractionBadge = (type) => {
    switch (type) {
      case 'call':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'email':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'meeting':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getListColorBadge = (color) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(contact.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${contact.isFavorite
                ? 'bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-slate-400 border-slate-200/80 hover:text-slate-600 hover:bg-slate-50'
              }`}
            title={contact.isFavorite ? 'Remove from favourites' : 'Mark as favourite'}
          >
            <Star className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <Link
            to={`/contacts/${contact.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Contact Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md select-none shrink-0">
              {getInitials(contact.firstName, contact.lastName)}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  {contact.firstName} {contact.lastName || ''}
                </h1>
                {contact.isFavorite && (
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                )}
              </div>

              <p className="text-slate-500 text-sm mt-1 flex flex-wrap items-center gap-1.5">
                {contact.designation && (
                  <span className="font-medium text-slate-800">
                    {contact.designation}
                  </span>
                )}
                {contact.designation && contact.company && <span>at</span>}
                {contact.company && (
                  <span className="font-medium text-slate-700">
                    {contact.company}
                  </span>
                )}
                {!contact.designation && !contact.company && (
                  <span>Individual Contact</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {contact.isDeleted ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                In Trash / Deleted
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Contact
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowAddInteractionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddFollowUpModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Add Follow-Up</span>
            </button>
          </div>
        </div>

        {/* Tags & Lists row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {contact.tags && contact.tags.length > 0 ? (
              contact.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No tags</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5" /> Lists:
            </span>
            {contactLists.length > 0 ? (
              contactLists.map((l) => (
                <span
                  key={l.id}
                  className={`text-xs font-medium px-2 py-0.5 rounded-lg border ${getListColorBadge(l.color)}`}
                >
                  {l.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No lists</span>
            )}
            <button
              type="button"
              onClick={() => setShowManageListsModal(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline ml-1 cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details / Notes / Activity Timeline / Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Contact Information & Activity History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Contact Channels */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-display font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Contact Channels</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  {contact.email && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(contact.email, 'Email')}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Copy email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-semibold text-blue-600 hover:underline block truncate"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Not specified</span>
                )}
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </span>
                  {contact.phone && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(contact.phone, 'Phone')}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Copy phone"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm font-semibold text-slate-800 hover:text-blue-600 block"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Not specified</span>
                )}
              </div>

              {/* Company */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                  <Building2 className="w-3.5 h-3.5" /> Organization
                </span>
                <span className="text-sm font-semibold text-slate-800 block">
                  {contact.company || 'Individual / None'}
                </span>
              </div>

              {/* Designation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> Role / Title
                </span>
                <span className="text-sm font-semibold text-slate-800 block">
                  {contact.designation || 'None specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Notes & Remarks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-display font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Notes & Background</span>
            </h2>

            {contact.notes ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {contact.notes}
              </div>
            ) : (
              <div className="text-center py-5 text-slate-400 text-xs italic">
                No general notes saved. Edit this contact to add notes.
              </div>
            )}
          </div>

          {/* Card: Activity & Interactions Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Activity & Interaction Timeline
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {interactions.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAddInteractionModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Activity</span>
              </button>
            </div>

            {loadingInteractions ? (
              <p className="text-xs text-slate-400 py-4 text-center">Loading timeline...</p>
            ) : interactions.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No activities logged yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Keep a complete CRM record by logging calls, meetings, emails, and notes.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddInteractionModal(true)}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Log First Interaction
                </button>
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
                {interactions.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-3 pl-2 group">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center shrink-0 z-10 shadow-xs">
                      {getInteractionIcon(item.type)}
                    </div>
                    <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${getInteractionBadge(
                              item.type
                            )}`}
                          >
                            {item.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.date || item.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteInteraction(item.id)}
                            className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Scheduled Follow-Ups & Metadata */}
        <div className="space-y-6">
          {/* Card: Follow-Up Tasks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Follow-Up Tasks
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFollowUpModal(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                + New
              </button>
            </div>

            {loadingFollowUps ? (
              <p className="text-xs text-slate-400 py-3 text-center">Loading tasks...</p>
            ) : followUps.length === 0 ? (
              <div className="text-center py-6 px-3 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-400 text-xs">
                <p>No follow-up tasks scheduled.</p>
                <button
                  type="button"
                  onClick={() => setShowAddFollowUpModal(true)}
                  className="mt-2 text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Schedule one now →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {followUps.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${task.status === 'completed'
                        ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
                        : task.timeCategory === 'overdue'
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-white border-slate-200/80 hover:border-blue-200'
                      }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFollowUp(task.id)}
                        className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${task.status === 'completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-blue-500 bg-white'
                          }`}
                        title={task.status === 'completed' ? 'Reopen task' : 'Mark completed'}
                      >
                        {task.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-snug ${task.status === 'completed'
                              ? 'line-through text-slate-400'
                              : 'text-slate-800'
                            }`}
                        >
                          {task.description}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          <span className="font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueDate}
                          </span>

                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${task.priority === 'high'
                                ? 'bg-rose-100 text-rose-700'
                                : task.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFollowUp(task.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: System Record Info */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              System Record Info
            </h2>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-slate-800 text-[11px] truncate max-w-[160px]">
                  {contact.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span>
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                    : 'Initial seed'}
                </span>
              </div>
              {contact.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Modified:</span>
                  <span>
                    {new Date(contact.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Log Activity */}
      {showAddInteractionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Log Contact Activity</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddInteractionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInteraction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interaction Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'call', label: 'Call', icon: Phone },
                    { type: 'email', label: 'Email', icon: Mail },
                    { type: 'meeting', label: 'Meeting', icon: Users },
                    { type: 'note', label: 'Note', icon: FileText },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => setInteractionForm({ ...interactionForm, type: btn.type })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${interactionForm.type === btn.type
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <btn.icon className="w-4 h-4" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discussed proposal pricing"
                  value={interactionForm.title}
                  onChange={(e) => setInteractionForm({ ...interactionForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interactionForm.date}
                  onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Details *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="What was discussed or decided?"
                  value={interactionForm.note}
                  onChange={(e) => setInteractionForm({ ...interactionForm, note: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInteractionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Follow-Up */}
      {showAddFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-amber-500" />
                <span>Schedule Follow-Up Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddFollowUpModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send updated pricing deck and agreement draft"
                  value={followUpForm.description}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={followUpForm.dueDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={followUpForm.priority}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFollowUpModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Manage List Memberships */}
      {showManageListsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span>Manage Lists & Segments</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowManageListsModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select which custom lists and targeted segments{' '}
              <span className="font-semibold text-slate-800">{contact.firstName}</span> belongs to:
            </p>

            {allLists.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 mb-2">No custom lists created yet.</p>
                <Link
                  to="/lists"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Create your first list in Lists & Segments →
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {allLists.map((list) => {
                  const isMember = contactLists.some((cl) => cl.id === list.id);
                  return (
                    <div
                      key={list.id}
                      onClick={() => handleToggleListMembership(list.id, isMember)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isMember
                          ? 'bg-blue-50/70 border-blue-300'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${isMember ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                        >
                          {isMember && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{list.name}</p>
                          {list.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                              {list.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getListColorBadge(
                          list.color
                        )}`}
                      >
                        {list.contactsCount || 0} contacts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowManageListsModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Move Contact to Trash?
              </h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">
                  {contact.firstName} {contact.lastName || ''}
                </span>
                ? You can restore this contact at any time from Deleted Contacts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
