import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Star,
  Eye,
  Edit2,
  Trash2,
  Building2,
  Mail,
  Phone,
  Calendar,
  Filter,
  X,
  AlertTriangle,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useContacts } from '../App.jsx';


export default function Contacts() {
  const {
    activeContacts,
    deleteContact,
    toggleFavorite,
    searchQuery,
    setSearchQuery
  } = useContacts();

  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
    const navigate = useNavigate();

  // Filter tabs: 'all', 'favourites', 'followups'
  const [activeTab, setActiveTab] = useState(filterParam === 'favourites' ? 'favourites' : 'all');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'recent', 'followup'

  // Delete modal state
  const [contactToDelete, setContactToDelete] = useState(null);

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    if (filterParam === 'favourites') {
      setActiveTab('favourites');
    }
  }, [filterParam]);

  // Extract all unique tags across active contacts
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    activeContacts.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [activeContacts]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    return activeContacts
      .filter((contact) => {
        // Tab filter
        if (activeTab === 'favourites' && !contact.isFavorite) return false;
        if (activeTab === 'followups' && !contact.followUpDate) return false;

        // Tag filter
        if (selectedTag !== 'ALL') {
          if (!contact.tags || !contact.tags.includes(selectedTag)) return false;
        }

        // Search Query filter (matches first name, last name, email, phone, company, designation, tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
          const email = (contact.email || '').toLowerCase();
          const company = (contact.company || '').toLowerCase();
          const phone = (contact.phone || '').toLowerCase();
          const designation = (contact.designation || '').toLowerCase();
          const tagsMatch = (contact.tags || []).some((t) => t.toLowerCase().includes(q));

          return (
            fullName.includes(q) ||
            email.includes(q) ||
            company.includes(q) ||
            phone.includes(q) ||
            designation.includes(q) ||
            tagsMatch
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          const nameA = `${a.firstName} ${a.lastName || ''}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName || ''}`.toLowerCase();
          return nameA.localeCompare(nameB);
        }
        if (sortBy === 'name-desc') {
          const nameA = `${a.firstName} ${a.lastName || ''}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName || ''}`.toLowerCase();
          return nameB.localeCompare(nameA);
        }
        if (sortBy === 'recent') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'followup') {
          if (!a.followUpDate) return 1;
          if (!b.followUpDate) return -1;
          return new Date(a.followUpDate) - new Date(b.followUpDate);
        }
        return 0;
      });
  }, [activeContacts, activeTab, selectedTag, searchQuery, sortBy]);

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      setContactToDelete(null);
    }
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
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <Clock className="w-3 h-3" />
          {dateStr} (Overdue)
        </span>
      );
    } else if (diff === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3" />
          Today
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
        <Calendar className="w-3 h-3 text-slate-400" />
        {dateStr}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Contacts Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
              {filteredContacts.length}{" "}
              {filteredContacts.length === 1 ? "contact" : "contacts"}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Browse, search, edit, and organize all personal and professional
            contacts.
          </p>
        </div>

        <Link
          to="/contacts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs shadow-blue-600/30 transition-all hover:shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Contact</span>
        </Link>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        {/* Top row: Tab Buttons & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchParams({});
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              All Contacts ({activeContacts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("favourites");
                setSearchParams({ filter: "favourites" });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "favourites"
                  ? "bg-white text-amber-700 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>
                Favourites ({activeContacts.filter((c) => c.isFavorite).length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/follow-ups")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "followups"
                  ? "bg-white text-blue-700 font-semibold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Follow-ups ({activeContacts.filter((c) => c.followUpDate).length})
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="recent">Recently Added</option>
              <option value="followup">Follow-up Due Date</option>
            </select>
          </div>
        </div>

        {/* Second row: Search box (own row) and Tag filters (below it) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Search box: full width on mobile, max 448px on desktop */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, company, or phone..."
              className="w-full pl-9 pr-9 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 flex items-center gap-1 pr-1 shrink-0">
                <Tag className="w-3.5 h-3.5" />
                Tag:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTag("ALL")}
                className={`text-xs px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                  selectedTag === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag(tag === selectedTag ? "ALL" : tag)
                  }
                  className={`text-xs px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contacts Content: Table for Desktop & Cards for Mobile */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No contacts found
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {searchQuery || selectedTag !== "ALL" || activeTab !== "all"
              ? "No contacts match your current search and filter criteria."
              : "Your contact list is currently empty."}
          </p>
          {searchQuery || selectedTag !== "ALL" || activeTab !== "all" ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("ALL");
                setActiveTab("all");
                setSearchParams({});
              }}
              className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/contacts/new"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Contact</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 w-12 text-center"
                    >
                      Fav
                    </th>
                    <th scope="col" className="py-3.5 px-3">
                      Contact Name
                    </th>
                    <th scope="col" className="py-3.5 px-3">
                      Company & Role
                    </th>
                    <th scope="col" className="py-3.5 px-3">
                      Contact Info
                    </th>
                    <th scope="col" className="py-3.5 px-3">
                      Tags
                    </th>
                    <th scope="col" className="py-3.5 px-3">
                      Follow-up
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-3 pr-6 text-right w-32"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Favourite Star */}
                      <td className="py-4 pl-6 pr-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(contact.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            contact.isFavorite
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-slate-300 hover:text-amber-500"
                          }`}
                          title={
                            contact.isFavorite
                              ? "Remove favourite"
                              : "Mark favourite"
                          }
                        >
                          <Star
                            className={`w-4 h-4 ${
                              contact.isFavorite ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {getInitials(contact.firstName, contact.lastName)}
                          </div>
                          <div>
                            <Link
                              to={`/contacts/${contact.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block text-sm"
                            >
                              {contact.firstName} {contact.lastName}
                            </Link>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {contact.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Designation */}
                      <td className="py-4 px-3">
                        <div className="text-slate-800 font-medium text-xs">
                          {contact.company || "—"}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {contact.designation || "No designation"}
                        </div>
                      </td>

                      {/* Contact Info (Email & Phone) */}
                      <td className="py-4 px-3">
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-blue-600 hover:underline truncate max-w-[180px]"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`tel:${contact.phone}`}
                              className="hover:text-blue-600"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        {!contact.email && !contact.phone && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="py-4 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {contact.tags && contact.tags.length > 0 ? (
                            contact.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/50"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Follow-up Date */}
                      <td className="py-4 px-3">
                        {contact.followUpDate ? (
                          formatFollowUp(contact.followUpDate)
                        ) : (
                          <span className="text-xs text-slate-400">
                            None set
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/contacts/${contact.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Contact Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/contacts/${contact.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setContactToDelete(contact)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div>
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 block"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {contact.designation ? `${contact.designation} • ` : ""}
                        {contact.company || "Individual"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(contact.id)}
                    className="p-1.5 text-slate-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        contact.isFavorite
                          ? "fill-amber-500 text-amber-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Info block */}
                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.followUpDate && (
                    <div className="flex items-center gap-2 pt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Follow-up: {contact.followUpDate}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    View
                  </Link>
                  <Link
                    to={`/contacts/${contact.id}/edit`}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setContactToDelete(contact)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
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
                  "{contactToDelete.firstName} {contactToDelete.lastName || ""}
                  ".trim()
                </span>
                ? This contact will be placed into the Deleted Contacts bin and
                can be restored at any time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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

