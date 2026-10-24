import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CalendarClock,
  Star,
  Plus,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function Dashboard() {
  const { activeContacts, toggleFavorite } = useContacts();

  // Calculate summary metrics
  const totalContacts = activeContacts.length;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const addedThisMonth = activeContacts.filter((c) => {
    if (!c.createdAt) return false;
    const date = new Date(c.createdAt);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  }).length;

  const favouritesCount = activeContacts.filter((c) => c.isFavorite).length;

  // Contacts with follow-ups
  const todayStr = new Date().toISOString().split('T')[0];
  const contactsWithFollowUps = activeContacts
    .filter((c) => c.followUpDate)
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

  const followUpsDueCount = contactsWithFollowUps.length;

  // Recent contacts (sorted by createdAt or updatedAt desc)
  const recentContacts = [...activeContacts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Upcoming follow-ups (next 5)
  const upcomingFollowUps = contactsWithFollowUps.slice(0, 5);

  // Helper function for follow-up date status badge
  const getFollowUpStatus = (dateStr) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `${Math.abs(diffDays)}d Overdue`,
        badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        icon: AlertTriangle,
      };
    } else if (diffDays === 0) {
      return {
        label: 'Due Today',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
      };
    } else if (diffDays === 1) {
      return {
        label: 'Tomorrow',
        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Clock,
      };
    } else {
      return {
        label: `In ${diffDays} days`,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Calendar,
      };
    }
  };

  // Helper for contact initials avatar
  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'C';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-blue-100 mb-3">
            <span>Contact Management CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
            Overview Dashboard
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            Welcome back! Monitor your contact relationships, prioritize upcoming follow-ups, and keep track of leads in one centralized place.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/contacts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Contact</span>
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl border border-white/20 transition-colors"
            >
              <span>View All Contacts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Contacts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Contacts
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900">{totalContacts}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">All registered contacts in CRM</p>
        </div>

        {/* Card 2: Added This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Added This Month
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900">{addedThisMonth}</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {now.toLocaleString('default', { month: 'short' })}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">New contacts created in current month</p>
        </div>

        {/* Card 3: Follow-ups Due */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Follow-ups Due
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900">{followUpsDueCount}</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Scheduled
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Contacts awaiting follow-up action</p>
        </div>

        {/* Card 4: Favourites */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Favourites
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Star className="w-5 h-5 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900">{favouritesCount}</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Starred
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Important priority relationships</p>
        </div>
      </div>

      {/* Main Content Split: Recent Contacts & Upcoming Follow-ups */}
      {totalContacts === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 mb-2">No Contacts Found</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Your CRM directory is empty right now. Add your first contact or use the sample contacts to get started.
          </p>
          <Link
            to="/contacts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Contact</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Recent Contacts */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-bold text-slate-900">Recent Contacts</h2>
                <p className="text-xs text-slate-500">Recently created or updated in CRM</p>
              </div>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                <span>View all ({totalContacts})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/contacts/${contact.id}`}
                          className="font-semibold text-slate-900 text-sm hover:text-blue-600 truncate block transition-colors"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                        {contact.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                        {contact.designation && <span>{contact.designation}</span>}
                        {contact.designation && contact.company && <span>•</span>}
                        {contact.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {contact.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Tags preview */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {(contact.tags || []).slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick Favourite Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(contact.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        contact.isFavorite
                          ? 'border-amber-200 bg-amber-50 text-amber-500'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                      title={contact.isFavorite ? 'Remove favourite' : 'Mark favourite'}
                    >
                      <Star
                        className={`w-4 h-4 ${contact.isFavorite ? 'fill-amber-500' : ''}`}
                      />
                    </button>

                    <Link
                      to={`/contacts/${contact.id}`}
                      className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (1 span): Upcoming Follow-ups */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-bold text-slate-900">Upcoming Follow-ups</h2>
                <p className="text-xs text-slate-500">Scheduled reminders</p>
              </div>
              <Link
                to="/follow-ups"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="p-4 flex-1">
              {upcomingFollowUps.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <CalendarClock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">No pending follow-ups</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Assign follow-up dates when editing or creating contacts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingFollowUps.map((contact) => {
                    const status = getFollowUpStatus(contact.followUpDate);
                    return (
                      <div
                        key={contact.id}
                        className="p-3 rounded-xl border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/contacts/${contact.id}`}
                            className="font-semibold text-sm text-slate-900 hover:text-blue-600 truncate transition-colors"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {status && (
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.badgeClass}`}
                            >
                              {status.label}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {contact.company || 'Individual'}
                          </span>
                          <span className="font-mono text-slate-600 text-[11px]">
                            {contact.followUpDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link
                to="/follow-ups"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              >
                <span>Manage Follow-up Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

