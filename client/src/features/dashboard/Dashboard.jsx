import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarClock,
  Star,
  Plus,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  FolderOpen,
  MessageSquare,
  Check,
  TrendingUp,
  History
} from 'lucide-react';
import { useContacts } from '../../App.jsx';
import * as dashboardApi from '../../api/dashboardApi.js';
import * as followUpApi from '../../api/followUpApi.js';

export default function Dashboard() {
  const { activeContacts, toggleFavorite, showToast } = useContacts();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, followUpsData] = await Promise.all([
        dashboardApi.getDashboardStats().catch(() => null),
        followUpApi.getAllFollowUps({ status: 'pending' }).catch(() => []),
      ]);
      setStats(statsData);
      setUpcomingFollowUps(followUpsData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [activeContacts]);

  const handleToggleTask = async (id) => {
    try {
      await followUpApi.toggleFollowUpStatus(id);
      showToast('Task marked as completed!');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const getInitials = (first, last) => {
    return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'C';
  };

  const metrics = stats?.metrics || {
    totalActiveContacts: activeContacts.length,
    favoriteContacts: activeContacts.filter((c) => c.isFavorite).length,
    addedThisMonth: 0,
    totalLists: 0,
    totalInteractions: 0,
    followUps: {
      total: 0,
      overdue: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
      pendingTotal: 0,
    },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CRM Control Center & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
            Welcome to your Contact & Client Hub
          </h1>
          <p className="text-blue-100/90 text-sm mt-2 leading-relaxed">
            Monitor client relationships, track scheduled follow-ups, organize target lists, and log calls & interactions seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              to="/contacts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add New Contact</span>
            </Link>

            <Link
              to="/follow-ups"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <CalendarClock className="w-4 h-4 text-amber-300" />
              <span>Manage Agenda</span>
            </Link>

            <Link
              to="/lists"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-blue-200" />
              <span>Custom Lists</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Active Contacts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Contacts
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-display font-bold text-slate-900">
              {metrics.totalActiveContacts}
            </p>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{metrics.addedThisMonth} this month
            </span>
          </div>
        </div>

        {/* Pending Follow-Ups */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Follow-Ups
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-display font-bold text-slate-900">
              {metrics.followUps.pendingTotal}
            </p>
            {metrics.followUps.overdue > 0 ? (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                {metrics.followUps.overdue} Overdue
              </span>
            ) : (
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                {metrics.followUps.today} Today
              </span>
            )}
          </div>
        </div>

        {/* Custom Lists & Segments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Target Lists
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-display font-bold text-slate-900">
              {metrics.totalLists}
            </p>
            <Link
              to="/lists"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all lists →
            </Link>
          </div>
        </div>

        {/* Total Interactions Logged */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Interactions Logged
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-display font-bold text-slate-900">
              {metrics.totalInteractions}
            </p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {metrics.favoriteContacts} starred
            </span>
          </div>
        </div>
      </div>

      {/* CRM Activity Channels Breakdown Bar */}
      {stats?.interactionBreakdown && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Client Interaction Activity by Channel
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-900">Phone Calls</p>
                <p className="text-base font-bold text-emerald-800">
                  {stats.interactionBreakdown.call || 0}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-900">Emails</p>
                <p className="text-base font-bold text-blue-800">
                  {stats.interactionBreakdown.email || 0}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-900">Meetings</p>
                <p className="text-base font-bold text-purple-800">
                  {stats.interactionBreakdown.meeting || 0}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-900">Notes & Logs</p>
                <p className="text-base font-bold text-amber-800">
                  {stats.interactionBreakdown.note || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Upcoming Follow-ups & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Upcoming Agenda Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-display font-bold text-slate-900">
                Action Items & Follow-ups
              </h2>
            </div>
            <Link
              to="/follow-ups"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingFollowUps.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">All caught up!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No pending follow-ups scheduled.</p>
              <Link
                to="/follow-ups"
                className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                Schedule a follow-up →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingFollowUps.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/40 hover:bg-white transition-all flex items-start gap-3"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-0.5 w-4 h-4 rounded-md border border-slate-300 hover:border-blue-500 bg-white flex items-center justify-center shrink-0"
                    title="Mark task completed"
                  >
                    <Check className="w-3 h-3 text-transparent hover:text-slate-400" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <Link
                        to={`/contacts/${task.contactId}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {task.contactName}
                      </Link>
                      <span>•</span>
                      <span className="font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Recent Activity Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-display font-bold text-slate-900">
                Recent Activity Stream
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Live feed</span>
          </div>

          {!stats?.recentActivities || stats.recentActivities.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No recent activity logs.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Log calls, meetings, or notes from any contact details page.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                    {act.type === 'email' && <Mail className="w-3.5 h-3.5" />}
                    {act.type === 'meeting' && <Users className="w-3.5 h-3.5" />}
                    {act.type === 'note' && <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(act.date || act.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {act.note}
                    </p>

                    <Link
                      to={`/contacts/${act.contactId}`}
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 block"
                    >
                      {act.contactName || 'View Contact'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row: Recently Added Contacts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-display font-bold text-slate-900">
              Recently Added Contacts
            </h2>
          </div>
          <Link
            to="/contacts"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View all {activeContacts.length} contacts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeContacts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No contacts found in your database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeContacts.slice(0, 6).map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/contacts/${contact.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate block"
                    >
                      {contact.firstName} {contact.lastName || ''}
                    </Link>
                    <p className="text-[11px] text-slate-400 truncate">
                      {contact.company || contact.email || 'No company'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(contact.id)}
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 ${contact.isFavorite
                      ? 'bg-amber-50 text-amber-500 border-amber-200'
                      : 'text-slate-300 border-transparent hover:text-slate-500'
                    }`}
                  title="Toggle favourite"
                >
                  <Star className={`w-3.5 h-3.5 ${contact.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
