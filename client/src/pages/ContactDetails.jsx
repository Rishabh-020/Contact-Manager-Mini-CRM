import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Star,
  Edit2,
  Trash2,
  Tag,
  FileText,
  User,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    contacts,
    deleteContact,
    toggleFavorite,
    showToast
  } = useContacts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const contact = contacts.find((c) => c.id === id);

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

  const formatFollowUp = (dateStr) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return {
        label: `Overdue (${Math.abs(diff)} days ago)`,
        className: 'bg-rose-100 text-rose-700 border-rose-200',
        icon: AlertTriangle,
      };
    } else if (diff === 0) {
      return {
        label: 'Due Today',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
      };
    } else if (diff === 1) {
      return {
        label: 'Due Tomorrow',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Clock,
      };
    } else {
      return {
        label: `Due in ${diff} days`,
        className: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Calendar,
      };
    }
  };

  const followUpStatus = formatFollowUp(contact.followUpDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Contacts</span>
        </Link>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Favourite Toggle */}
          <button
            type="button"
            onClick={() => toggleFavorite(contact.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              contact.isFavorite
                ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                contact.isFavorite
                  ? "fill-amber-500 text-amber-500"
                  : "text-slate-400"
              }`}
            />
            <span>
              {contact.isFavorite ? "Favourited" : "Add to Favourites"}
            </span>
          </button>

          {/* Edit */}
          <Link
            to={`/contacts/${contact.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner strip */}
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800" />

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and name header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              {/* Only the avatar moves up into the banner */}
              <div className="-mt-12 w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-display font-bold text-2xl flex items-center justify-center shadow-lg border-4 border-white shrink-0">
                {getInitials(contact.firstName, contact.lastName)}
              </div>

              {/* Name sits below the banner */}
              <div className="pt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                    {contact.firstName} {contact.lastName}
                  </h1>
                  {contact.isFavorite && (
                    <span className="p-1 rounded-md bg-amber-50 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  {contact.designation && <span>{contact.designation}</span>}
                  {contact.designation && contact.company && <span>at</span>}
                  {contact.company && (
                    <span className="font-medium text-slate-700">
                      {contact.company}
                    </span>
                  )}
                  {!contact.designation && !contact.company && (
                    <span>Personal Contact</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3">
              {contact.isDeleted ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                  In Trash / Deleted
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Contact
                </span>
              )}
            </div>
          </div>

          {/* Tags preview */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {contact.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Contact Information & Follow-Up / Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Contact Details & Notes */}
        <div className="md:col-span-2 space-y-6">
          {/* Card: Contact Channels */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
              Contact Channels
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
                      onClick={() => copyToClipboard(contact.email, "Email")}
                      className="text-slate-400 hover:text-slate-600"
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
                  <span className="text-xs text-slate-400 italic">
                    Not specified
                  </span>
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
                      onClick={() => copyToClipboard(contact.phone, "Phone")}
                      className="text-slate-400 hover:text-slate-600"
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
                  <span className="text-xs text-slate-400 italic">
                    Not specified
                  </span>
                )}
              </div>

              {/* Company */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                  <Building2 className="w-3.5 h-3.5" /> Organization
                </span>
                <span className="text-sm font-semibold text-slate-800 block">
                  {contact.company || "Individual / None"}
                </span>
              </div>

              {/* Designation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> Role / Title
                </span>
                <span className="text-sm font-semibold text-slate-800 block">
                  {contact.designation || "None specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Notes & Background */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-display font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Notes & CRM Remarks</span>
            </h2>

            {contact.notes ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {contact.notes}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs italic">
                No notes or remarks saved for this contact yet. Click "Edit" to
                add some.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Follow-up Agenda & Meta */}
        <div className="space-y-6">
          {/* Card: Follow-up Agenda */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-display font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Follow-up Reminder</span>
            </h2>

            {contact.followUpDate ? (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    Scheduled Date:
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {contact.followUpDate}
                  </span>
                </div>
                {followUpStatus && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${followUpStatus.className}`}
                  >
                    <followUpStatus.icon className="w-3.5 h-3.5" />
                    <span>{followUpStatus.label}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    to={`/contacts/${contact.id}/edit`}
                    className="text-xs text-blue-600 hover:underline font-semibold block"
                  >
                    Reschedule or change date →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-center space-y-2">
                <p className="text-xs text-slate-500">
                  No follow-up reminder is set.
                </p>
                <Link
                  to={`/contacts/${contact.id}/edit`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Set reminder</span>
                </Link>
              </div>
            )}
          </div>

          {/* Card: Record Metadata */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              System Record Info
            </h2>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-slate-800">{contact.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span>
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "Initial seed"}
                </span>
              </div>
              {contact.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Modified:</span>
                  <span>
                    {new Date(contact.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Storage:</span>
                <span className="text-emerald-600 font-medium">
                  Server (data/contacts.json)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Dialog */}
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
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {contact.firstName} {contact.lastName}
                </span>
                ? You can restore this contact at any time from the Deleted
                Contacts menu.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
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

