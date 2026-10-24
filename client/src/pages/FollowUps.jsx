import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  Plus,
  Check,
  User,
  Star
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function FollowUps() {
  const { activeContacts, updateContact, showToast } = useContacts();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'overdue', 'today', 'upcoming'

  // Contacts with follow-ups scheduled
  const followUpContacts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activeContacts
      .filter((c) => Boolean(c.followUpDate))
      .map((c) => {
        const target = new Date(c.followUpDate);
        target.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

        let status = 'upcoming';
        if (diffDays < 0) status = 'overdue';
        else if (diffDays === 0) status = 'today';

        return {
          ...c,
          diffDays,
          status,
        };
      })
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
  }, [activeContacts]);

  // Counts
  const overdueCount = followUpContacts.filter((c) => c.status === 'overdue').length;
  const todayCount = followUpContacts.filter((c) => c.status === 'today').length;
  const upcomingCount = followUpContacts.filter((c) => c.status === 'upcoming').length;

  // Filtered by tab
  const displayedContacts = useMemo(() => {
    if (activeTab === 'overdue') return followUpContacts.filter((c) => c.status === 'overdue');
    if (activeTab === 'today') return followUpContacts.filter((c) => c.status === 'today');
    if (activeTab === 'upcoming') return followUpContacts.filter((c) => c.status === 'upcoming');
    return followUpContacts;
  }, [followUpContacts, activeTab]);

  // Quick mark completed
  const handleMarkCompleted = (contact) => {
    updateContact(contact.id, {
      followUpDate: null,
      notes: contact.notes
        ? `${contact.notes}\n[Follow-up completed on ${new Date().toISOString().split('T')[0]}]`
        : `[Follow-up completed on ${new Date().toISOString().split('T')[0]}]`,
    });
    showToast(`Follow-up for ${contact.firstName} marked as completed!`);
  };

  // Quick reschedule (+X days)
  const handleReschedule = (contact, daysToAdd) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    const dateStr = newDate.toISOString().split('T')[0];

    updateContact(contact.id, {
      followUpDate: dateStr,
    });
    showToast(`Rescheduled to ${dateStr}`);
  };

  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'C';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Follow-up Reminders
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200/60">
              {followUpContacts.length} pending
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Keep commitments on track. Review calls, demos, and check-ins due with contacts.
          </p>
        </div>

        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <span>Assign to Contact</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Reminders ({followUpContacts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Overdue ({overdueCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'today'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 border border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Due Today ({todayCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'upcoming'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming ({upcomingCount})</span>
        </button>
      </div>

      {/* Follow-up Cards */}
      {displayedContacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {activeTab === 'all'
              ? 'No Follow-ups Scheduled'
              : `No ${activeTab} follow-ups`}
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {activeTab === 'all'
              ? 'You have completed all scheduled follow-ups or have not set any reminder dates yet.'
              : `There are currently no contacts in the "${activeTab}" filter.`}
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
          >
            <span>Browse Contacts Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                contact.status === 'overdue'
                  ? 'border-rose-200/80 bg-rose-50/20'
                  : contact.status === 'today'
                  ? 'border-amber-200/80 bg-amber-50/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div>
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors block"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {contact.company || 'Individual'}
                        {contact.designation && ` • ${contact.designation}`}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {contact.status === 'overdue' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      {Math.abs(contact.diffDays)}d Overdue
                    </span>
                  )}
                  {contact.status === 'today' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      Due Today
                    </span>
                  )}
                  {contact.status === 'upcoming' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      <Calendar className="w-3 h-3" />
                      In {contact.diffDays} days
                    </span>
                  )}
                </div>

                {/* Target Date */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {contact.followUpDate}
                  </span>
                </div>

                {/* Notes preview */}
                {contact.notes && (
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 italic">
                    "{contact.notes}"
                  </p>
                )}

                {/* Contact channels */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 hover:text-blue-600 truncate max-w-[200px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.email}</span>
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Reschedule:</span>
                  <button
                    type="button"
                    onClick={() => handleReschedule(contact, 1)}
                    className="text-[11px] font-semibold px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    +1d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReschedule(contact, 3)}
                    className="text-[11px] font-semibold px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    +3d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReschedule(contact, 7)}
                    className="text-[11px] font-semibold px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    +1w
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkCompleted(contact)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

