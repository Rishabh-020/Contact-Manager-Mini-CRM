import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Phone,
  Plus,
  Check,
  User,
  Trash2,
  X,
  Filter
} from 'lucide-react';
import { useContacts } from '../../App.jsx';
import * as followUpApi from '../../api/followUpApi.js';

export default function FollowUps() {
  const { activeContacts, showToast, loadContacts } = useContacts();

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'all', 'overdue', 'today', 'upcoming', 'completed'
  const [activeTab, setActiveTab] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form, setForm] = useState({
    contactId: '',
    description: '',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
  });

  const loadAllTasks = async () => {
    try {
      setLoading(true);
      const data = await followUpApi.getAllFollowUps({ status: 'all' });
      setFollowUps(data);
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllTasks();
  }, []);

  // Compute counts
  const overdueCount = followUps.filter((f) => f.status === 'pending' && f.timeCategory === 'overdue').length;
  const todayCount = followUps.filter((f) => f.status === 'pending' && f.timeCategory === 'today').length;
  const upcomingCount = followUps.filter((f) => f.status === 'pending' && f.timeCategory === 'upcoming').length;
  const completedCount = followUps.filter((f) => f.status === 'completed').length;
  const totalPending = overdueCount + todayCount + upcomingCount;

  // Filter tasks
  const displayedFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      // Tab filter
      if (activeTab === 'overdue') {
        if (f.status !== 'pending' || f.timeCategory !== 'overdue') return false;
      } else if (activeTab === 'today') {
        if (f.status !== 'pending' || f.timeCategory !== 'today') return false;
      } else if (activeTab === 'upcoming') {
        if (f.status !== 'pending' || f.timeCategory !== 'upcoming') return false;
      } else if (activeTab === 'completed') {
        if (f.status !== 'completed') return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && f.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [followUps, activeTab, priorityFilter]);

  // Toggle complete / reopen
  const handleToggleTask = async (id) => {
    try {
      const updated = await followUpApi.toggleFollowUpStatus(id);
      setFollowUps((prev) => prev.map((f) => (f.id === id ? updated : f)));
      showToast(
        updated.status === 'completed'
          ? 'Task marked as completed!'
          : 'Task reopened.'
      );
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await followUpApi.deleteFollowUp(id);
      showToast('Follow-up task deleted.', 'info');
      setFollowUps((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // Schedule task
  const handleScheduleTask = async (e) => {
    e.preventDefault();
    if (!form.contactId) {
      showToast('Please select a contact.', 'warning');
      return;
    }
    if (!form.description.trim() || !form.dueDate) {
      showToast('Please provide a task description and due date.', 'warning');
      return;
    }

    try {
      await followUpApi.createFollowUp(form);
      showToast('Follow-up task scheduled successfully!');
      setShowScheduleModal(false);
      setForm({
        contactId: '',
        description: '',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        priority: 'medium',
      });
      loadAllTasks();
      loadContacts();
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Follow-ups & Agenda
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200/60">
              {totalPending} Pending Tasks
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Stay on top of customer check-ins, sales inquiries, contract renewals, and scheduled reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeContacts.length > 0) {
              setForm((prev) => ({ ...prev, contactId: activeContacts[0].id }));
            }
            setShowScheduleModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Metric Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeTab === 'overdue'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-rose-700">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-display text-rose-700">{overdueCount}</p>
        </div>

        <div
          onClick={() => setActiveTab('today')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeTab === 'today'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-amber-700">Due Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-display text-amber-700">{todayCount}</p>
        </div>

        <div
          onClick={() => setActiveTab('upcoming')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeTab === 'upcoming'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700">Upcoming</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-display text-blue-700">{upcomingCount}</p>
        </div>

        <div
          onClick={() => setActiveTab('completed')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeTab === 'completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-display text-emerald-700">{completedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Priority Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Tasks', count: followUps.length },
            { id: 'overdue', label: 'Overdue', count: overdueCount },
            { id: 'today', label: 'Due Today', count: todayCount },
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-hidden font-medium text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <p className="text-sm text-slate-400">Loading follow-up tasks...</p>
        </div>
      ) : displayedFollowUps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <CalendarClock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Follow-ups Found</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {activeTab === 'all'
              ? 'Schedule your first follow-up task with a client or contact.'
              : `No follow-ups match the "${activeTab}" filter.`}
          </p>
          <button
            type="button"
            onClick={() => {
              if (activeContacts.length > 0) {
                setForm((prev) => ({ ...prev, contactId: activeContacts[0].id }));
              }
              setShowScheduleModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedFollowUps.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${task.status === 'completed'
                  ? 'border-slate-200 bg-slate-50/50 opacity-70'
                  : task.timeCategory === 'overdue'
                    ? 'border-rose-200/80 hover:border-rose-300 shadow-xs'
                    : 'border-slate-200/80 hover:border-blue-300 shadow-xs'
                }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${task.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                  title={task.status === 'completed' ? 'Reopen task' : 'Mark completed'}
                >
                  {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority} Priority
                    </span>

                    {task.status === 'completed' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completed
                      </span>
                    ) : task.timeCategory === 'overdue' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{Math.abs(task.diffDays)}d Overdue</span>
                      </span>
                    ) : task.timeCategory === 'today' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Due Today</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        In {task.diffDays} days
                      </span>
                    )}

                    <span className="text-xs font-mono text-slate-400">
                      Due: {task.dueDate}
                    </span>
                  </div>

                  <p
                    className={`text-sm font-semibold leading-snug ${task.status === 'completed'
                        ? 'line-through text-slate-400'
                        : 'text-slate-900'
                      }`}
                  >
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <Link
                      to={`/contacts/${task.contactId}`}
                      className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{task.contactName}</span>
                    </Link>

                    {task.contactCompany && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{task.contactCompany}</span>
                      </span>
                    )}

                    {task.contactPhone && (
                      <a
                        href={`tel:${task.contactPhone}`}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-600"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{task.contactPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  to={`/contacts/${task.contactId}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors"
                >
                  View Contact
                </Link>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete follow-up"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Schedule Follow-up Task */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span>Schedule New Follow-up</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign to Contact *
                </label>
                <select
                  required
                  value={form.contactId}
                  onChange={(e) => setForm({ ...form, contactId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-white"
                >
                  <option value="">Select a contact...</option>
                  {activeContacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call to finalize enterprise contract & pricing terms"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
