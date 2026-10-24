import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Users, Tag, ArrowRight, Plus } from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function Lists() {
  const { activeContacts } = useContacts();

  // Group contacts by tag
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
              {tagGroups.length} Active Segments
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Organize contacts into high-value target lists and relationship groups based on CRM tags.
          </p>
        </div>

        <Link
          to="/contacts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Contact Tag</span>
        </Link>
      </div>

      {/* Segments Grid */}
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
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {contactsInTag.length} {contactsInTag.length === 1 ? 'contact' : 'contacts'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                  {tagName}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Segment containing all contacts tagged with "{tagName}".
                </p>

                {/* Sample contacts in this segment */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
                  {contactsInTag.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="text-xs text-slate-700 flex items-center justify-between truncate"
                    >
                      <span className="font-medium truncate">
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="text-slate-400 text-[11px] truncate ml-2">
                        {c.company || '—'}
                      </span>
                    </div>
                  ))}
                  {contactsInTag.length > 3 && (
                    <span className="text-[11px] text-blue-600 font-medium block">
                      +{contactsInTag.length - 3} more...
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={`/contacts`}
                className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 group"
              >
                <span>Filter contacts in directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

