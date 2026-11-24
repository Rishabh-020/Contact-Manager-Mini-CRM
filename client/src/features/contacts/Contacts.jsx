import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Star,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Filter,
  X,
  AlertTriangle,
  ArrowUpDown,
  Tag,
  Clock,
  Download,
  FolderOpen,
  FolderPlus
} from 'lucide-react';
import { useContacts } from '../../App.jsx';
import * as listApi from '../../api/listApi.js';

export default function Contacts() {
  const {
    activeContacts,
    deleteContact,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    showToast
  } = useContacts();

  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const listIdParam = searchParams.get('listId');
  const tagParam = searchParams.get('tag');
  const navigate = useNavigate();

  // Filter tabs: 'all', 'favourites', 'followups'
  const [activeTab, setActiveTab] = useState(filterParam === 'favourites' ? 'favourites' : 'all');
  const [selectedTag, setSelectedTag] = useState(tagParam || 'ALL');
  const [selectedListId, setSelectedListId] = useState(listIdParam || 'ALL');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'recent', 'followup'

  // Custom Lists State
  const [customLists, setCustomLists] = useState([]);

  // Bulk Selection State
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [showBulkAddToListModal, setShowBulkAddToListModal] = useState(false);
  const [targetBulkListId, setTargetBulkListId] = useState('');

  // Delete modal state
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    if (filterParam === 'favourites') {
      setActiveTab('favourites');
    }
    if (listIdParam) {
      setSelectedListId(listIdParam);
    }
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [filterParam, listIdParam, tagParam]);

  // Load custom lists from server
  useEffect(() => {
    listApi
      .getAllLists()
      .then((data) => {
        setCustomLists(data);
        if (listIdParam && data.length > 0 && !targetBulkListId) {
          setTargetBulkListId(data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

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

  // Find contacts belonging to selected custom list
  const listMemberIdSet = useMemo(() => {
    if (selectedListId === 'ALL') return null;
    const found = customLists.find((l) => l.id === selectedListId);
    return found ? new Set(found.contactIds || []) : new Set();
  }, [selectedListId, customLists]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    return activeContacts
      .filter((contact) => {
        // Tab filter
        if (activeTab === 'favourites' && !contact.isFavorite) return false;
        if (activeTab === 'followups' && !contact.followUpDate) return false;

        // Custom List filter
        if (selectedListId !== 'ALL' && listMemberIdSet) {
          if (!listMemberIdSet.has(contact.id)) return false;
        }

        // Tag filter
        if (selectedTag !== 'ALL') {
          if (!contact.tags || !contact.tags.includes(selectedTag)) return false;
        }

        // Search Query filter
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
  }, [activeContacts, activeTab, selectedTag, selectedListId, listMemberIdSet, searchQuery, sortBy]);

  // Bulk Selection Toggles
  const isAllVisibleSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedContactIds.includes(c.id));

  const handleToggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const visibleIdSet = new Set(filteredContacts.map((c) => c.id));
      setSelectedContactIds((prev) => prev.filter((id) => !visibleIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedContactIds, ...filteredContacts.map((c) => c.id)]);
      setSelectedContactIds(Array.from(newIds));
    }
  };

  const handleToggleSelectContact = (id) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CSV & JSON Exporters
  const handleExportCSV = (contactsToExport) => {
    const dataList = contactsToExport.length > 0 ? contactsToExport : filteredContacts;
    if (dataList.length === 0) {
      showToast('No contacts available to export.', 'warning');
      return;
    }

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Designation',
      'Tags',
      'Notes',
      'Follow-Up Date',
    ];

    const rows = dataList.map((c) => [
      `"${(c.firstName || '').replace(/"/g, '""')}"`,
      `"${(c.lastName || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.company || '').replace(/"/g, '""')}"`,
      `"${(c.designation || '').replace(/"/g, '""')}"`,
      `"${((c.tags || []).join('; ')).replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
      `"${c.followUpDate || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataList.length} contacts to CSV!`);
  };

  const handleExportJSON = (contactsToExport) => {
    const dataList = contactsToExport.length > 0 ? contactsToExport : filteredContacts;
    if (dataList.length === 0) {
      showToast('No contacts available to export.', 'warning');
      return;
    }

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataList, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `contacts_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataList.length} contacts to JSON!`);
  };

  // Bulk Operations
  const handleBulkDelete = () => {
    selectedContactIds.forEach((id) => deleteContact(id));
    showToast(`Moved ${selectedContactIds.length} contacts to Deleted Contacts.`, 'info');
    setSelectedContactIds([]);
    setShowBulkDeleteModal(false);
  };

  const handleBulkAddToList = async () => {
    if (!targetBulkListId) {
      showToast('Please select a list.', 'warning');
      return;
    }
    try {
      await listApi.addContactsToList(targetBulkListId, selectedContactIds);
      showToast(`Added ${selectedContactIds.length} contacts to the list!`);
      setShowBulkAddToListModal(false);
      setSelectedContactIds([]);
      const updatedLists = await listApi.getAllLists();
      setCustomLists(updatedLists);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

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
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Contacts Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
              {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Browse, search, edit, export, and organize all personal and enterprise contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Dropdown / Buttons */}
          <button
            type="button"
            onClick={() => handleExportCSV(filteredContacts)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleExportJSON(filteredContacts)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200/80 transition-colors"
            title="Download JSON Backup"
          >
            <span>JSON</span>
          </button>

          <Link
            to="/contacts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Contact</span>
          </Link>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        {/* Top row: Tab Buttons & Sorting & Custom Lists Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setSearchParams({});
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              All Contacts ({activeContacts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('favourites');
                setSearchParams({ filter: 'favourites' });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'favourites'
                  ? 'bg-white text-amber-700 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Favourites ({activeContacts.filter((c) => c.isFavorite).length})</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/follow-ups')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'followups'
                  ? 'bg-white text-blue-700 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Follow-ups ({activeContacts.filter((c) => c.followUpDate).length})
            </button>
          </div>

          {/* Custom List Filter & Sort dropdown */}
          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
            {customLists.length > 0 && (
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedListId}
                  onChange={(e) => {
                    setSelectedListId(e.target.value);
                    if (e.target.value === 'ALL') {
                      searchParams.delete('listId');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ ...Object.fromEntries(searchParams), listId: e.target.value });
                    }
                  }}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:border-blue-500 outline-hidden font-medium"
                >
                  <option value="ALL">All Custom Lists</option>
                  {customLists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.contactsCount || 0})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:border-blue-500 outline-hidden font-medium"
              >
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="recent">Recently Added</option>
                <option value="followup">Follow-up Due Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Second row: Search box and Tag filters */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, company, or phone..."
              className="w-full pl-9 pr-9 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
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
                onClick={() => {
                  setSelectedTag('ALL');
                  searchParams.delete('tag');
                  setSearchParams(searchParams);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${selectedTag === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const next = tag === selectedTag ? 'ALL' : tag;
                    setSelectedTag(next);
                    if (next === 'ALL') {
                      searchParams.delete('tag');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ ...Object.fromEntries(searchParams), tag: next });
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedContactIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-slide-up">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-lg">
            {selectedContactIds.length} Selected
          </span>

          <div className="h-4 w-px bg-slate-700" />

          {customLists.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setTargetBulkListId(customLists[0].id);
                setShowBulkAddToListModal(true);
              }}
              className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const selectedList = activeContacts.filter((c) => selectedContactIds.includes(c.id));
              handleExportCSV(selectedList);
            }}
            className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Selected</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBulkDeleteModal(true)}
            className="text-xs font-semibold text-rose-300 hover:text-rose-100 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedContactIds([])}
            className="text-xs text-slate-400 hover:text-white p-1"
            title="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contacts Content: Table for Desktop & Cards for Mobile */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No contacts found</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {searchQuery || selectedTag !== 'ALL' || selectedListId !== 'ALL' || activeTab !== 'all'
              ? 'No contacts match your current search and filter criteria.'
              : 'Your contact list is currently empty.'}
          </p>
          {searchQuery || selectedTag !== 'ALL' || selectedListId !== 'ALL' || activeTab !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('ALL');
                setSelectedListId('ALL');
                setActiveTab('all');
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
                    <th scope="col" className="py-3.5 pl-4 pr-2 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllVisibleSelected}
                        onChange={handleToggleSelectAllVisible}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title="Select all visible contacts"
                      />
                    </th>
                    <th scope="col" className="py-3.5 px-2 w-10 text-center">
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
                    <th scope="col" className="py-3.5 pl-3 pr-6 text-right w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        className={`transition-colors group ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                          }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-4 pr-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectContact(contact.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Favourite Star */}
                        <td className="py-4 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(contact.id)}
                            className={`p-1.5 rounded-lg transition-colors ${contact.isFavorite
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-300 hover:text-amber-500'
                              }`}
                            title={contact.isFavorite ? 'Remove favourite' : 'Mark favourite'}
                          >
                            <Star
                              className={`w-4 h-4 ${contact.isFavorite ? 'fill-amber-500' : ''}`}
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
                                {contact.firstName} {contact.lastName || ''}
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
                            {contact.company || '—'}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {contact.designation || 'No designation'}
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
                              <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
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
                            <span className="text-xs text-slate-400">None set</span>
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
                    );
                  })}
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
                        {contact.firstName} {contact.lastName || ''}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {contact.designation ? `${contact.designation} • ` : ''}
                        {contact.company || 'Individual'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(contact.id)}
                    className="p-1.5 text-slate-400"
                  >
                    <Star
                      className={`w-4 h-4 ${contact.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                    />
                  </button>
                </div>

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

      {/* MODAL: Bulk Add to List */}
      {showBulkAddToListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-600" />
              <span>Add {selectedContactIds.length} Contacts to List</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Choose Target List
              </label>
              <select
                value={targetBulkListId}
                onChange={(e) => setTargetBulkListId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-white"
              >
                {customLists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkAddToListModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAddToList}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Bulk Delete Confirmation */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Move {selectedContactIds.length} Contacts to Trash?
              </h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Are you sure you want to delete these {selectedContactIds.length} selected contacts?
                They will be moved to Deleted Contacts and can be restored at any time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Yes, Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Contact Delete Modal */}
      {contactToDelete && (
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
                  {contactToDelete.firstName} {contactToDelete.lastName || ''}
                </span>
                ? This contact will be placed into Deleted Contacts and can be restored at any time.
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
