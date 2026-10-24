import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function DeletedContacts() {
  const {
    deletedContacts,
    restoreContact,
    permanentDeleteContact,
    showToast
  } = useContacts();

  const [contactToPurge, setContactToPurge] = useState(null);

  const handlePermanentDelete = () => {
    if (contactToPurge) {
      permanentDeleteContact(contactToPurge.id);
      setContactToPurge(null);
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in trash? This cannot be undone.')) {
      deletedContacts.forEach((c) => permanentDeleteContact(c.id));
      showToast('Trash emptied completely', 'warning');
    }
  };

  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'C';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Deleted Contacts Trash
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200/60">
              {deletedContacts.length} in trash
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Soft-deleted contacts are kept here safely. You can restore them anytime or erase them permanently.
          </p>
        </div>

        {deletedContacts.length > 0 && (
          <button
            type="button"
            onClick={handleEmptyTrash}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Entire Trash</span>
          </button>
        )}
      </div>

      {/* Main List */}
      {deletedContacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Trash is Empty</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            There are no deleted contacts in your trash bin right now.
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Active Contacts</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {deletedContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center shrink-0">
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      {contact.company && <span>{contact.company}</span>}
                      {contact.company && contact.designation && <span>•</span>}
                      {contact.designation && <span>{contact.designation}</span>}
                      {contact.email && <span>• {contact.email}</span>}
                    </div>
                    {contact.deletedAt && (
                      <p className="text-[11px] text-rose-500 mt-1 font-mono">
                        Deleted: {new Date(contact.deletedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => restoreContact(contact.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Contact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactToPurge(contact)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Forever</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Dialog */}
      {contactToPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Permanently Erase Record?
              </h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                This will irreversibly delete{' '}
                <span className="font-semibold text-slate-900">
                  {contactToPurge.firstName} {contactToPurge.lastName || ''}
                </span>{' '}
                from browser storage. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContactToPurge(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

