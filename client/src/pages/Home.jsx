import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  CalendarClock,
  FolderOpen,
  Search,
  UploadCloud,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Clock,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  LayoutDashboard,
  Check,
  X as CloseIcon,
  HelpCircle,
  MessageSquare,
  Award
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sampleContacts = [
    {
      name: 'Sarah Jenkins',
      title: 'VP of Partnerships',
      company: 'Apex Media',
      email: 'sarah.j@apexmedia.io',
      phone: '+1 (555) 234-5678',
      tag: 'VIP Client',
      tagColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      initials: 'SJ',
      avatarBg: 'bg-indigo-600',
      isFavorite: true,
      followUp: 'Today at 3:00 PM',
      followUpUrgent: true,
    },
    {
      name: 'Alex Rivera',
      title: 'Founder & CTO',
      company: 'Veloce Labs',
      email: 'alex@velocelabs.dev',
      phone: '+1 (555) 876-5432',
      tag: 'Sales Lead',
      tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
      initials: 'AR',
      avatarBg: 'bg-blue-600',
      isFavorite: false,
      followUp: 'Tomorrow, 11:00 AM',
      followUpUrgent: false,
    },
    {
      name: 'Priya Sharma',
      title: 'Senior Product Manager',
      company: 'FinStack Systems',
      email: 'priya@finstack.co',
      phone: '+91 98765 43210',
      tag: 'Partner',
      tagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      initials: 'PS',
      avatarBg: 'bg-emerald-600',
      isFavorite: true,
      followUp: 'Oct 28, 2026',
      followUpUrgent: false,
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Complete Contact Dossiers',
      description:
        'Store names, phone numbers, emails, company roles, social handles, and notes in one unified card.',
      badge: 'Core CRM',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: CalendarClock,
      title: 'Smart Follow-up Reminders',
      description:
        'Never let high-value conversations go cold. Schedule next touchpoints with visual alerts for today, upcoming, or overdue items.',
      badge: 'Reminders',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: FolderOpen,
      title: 'Lists & Custom Tagging',
      description:
        'Segment your network into VIPs, Warm Leads, Partners, or custom tags. Filter hundreds of contacts in a single tap.',
      badge: 'Organization',
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      icon: Search,
      title: 'Instant Multi-Field Search',
      description:
        'Lightning fast live filtering across names, emails, companies, and custom notes with zero latency or page reloads.',
      badge: 'Speed',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: UploadCloud,
      title: 'One-Click CSV Import & Export',
      description:
        'Migrate spreadsheets or Google Contacts effortlessly with client-side CSV parsing, data validation, and backup download.',
      badge: 'Data Freedom',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Trash2,
      title: 'Safe Trash & Instant Restore',
      description:
        'Accidentally deleted someone? Contacts are staged in a dedicated Recycle Bin so you can recover them anytime.',
      badge: 'Protection',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const faqs = [
    {
      q: 'What is Mini-CRM and who is it designed for?',
      a: 'Mini-CRM is a lightweight, responsive contact management platform built for freelancers, entrepreneurs, sales professionals, and students who need a clean, fast way to organize relationships and follow-ups without the bloat of expensive enterprise tools.',
    },
    {
      q: 'Is there a demo account available to test right away?',
      a: 'Yes! You can instantly test the system using the pre-configured demo account: Email: admin@minicrm.college, Password: password123. It comes populated with sample contacts, tags, and follow-ups.',
    },
    {
      q: 'Can I import my existing contacts from Excel or Google Contacts?',
      a: 'Absolutely. Mini-CRM includes a built-in CSV Import tool. You can map standard columns (Name, Email, Phone, Company, Notes, Tags) and populate your directory in seconds.',
    },
    {
      q: 'How does the Follow-Up Reminder feature work?',
      a: 'When viewing or editing a contact, you can assign a follow-up date and note. The system automatically categorizes your schedule into Overdue, Today, and Upcoming, displaying color-coded badges and countdowns.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. Mini-CRM uses secure JWT token-based authentication, bcrypt password hashing on the backend, and isolated user data partitions so every user only ever accesses their own contacts.',
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50">
        {/* Soft background ambient glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute top-48 -right-20 w-80 h-80 bg-blue-200/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-blue-800">
                Next-Gen Relationship Management
              </span>
              <span className="text-blue-300">•</span>
              <span className="text-xs font-medium text-blue-600">v2.0 Active</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Manage Contacts.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Never Miss a Follow-up.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              A minimalist, blazing-fast contact manager and mini-CRM. Keep track of conversations,
              schedule important touchpoints, and segment your network without confusing enterprise bloat.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Open Your Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contacts"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Browse Contacts ({user.name ? user.name.split(' ')[0] : 'User'})</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Try Live Demo</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-xs">
                <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">&lt;10ms Search</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-xs">
                <CalendarClock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Smart Alerts</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-xs">
                <UploadCloud className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">CSV Import</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">100% Private</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Showcase Mockup */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/40 overflow-hidden">
              {/* Window Header */}
              <div className="bg-slate-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                    mini-crm.local/dashboard
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dashboard View
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contacts')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'contacts'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Contact Roster
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'pipeline'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Follow-up Radar
                  </button>
                </div>
              </div>

              {/* Showcase Body */}
              <div className="p-5 sm:p-8 bg-slate-50/50">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Total Contacts
                          </span>
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold font-display text-slate-900">128</p>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          +12 this month
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Follow-ups Due
                          </span>
                          <CalendarClock className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold font-display text-slate-900">4</p>
                        <span className="text-[11px] text-amber-600 font-medium">
                          1 scheduled today
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Favourites
                          </span>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                        <p className="text-2xl font-bold font-display text-slate-900">19</p>
                        <span className="text-[11px] text-slate-500 font-medium">VIP Tier</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Response Rate
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-bold font-display text-slate-900">96.4%</p>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          Top Tier Network
                        </span>
                      </div>
                    </div>

                    {/* Recent Contact Row Previews */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Priority Contact Queue
                        </h3>
                        <span className="text-xs text-blue-600 font-semibold">Live Preview</span>
                      </div>
                      <div className="space-y-2.5">
                        {sampleContacts.map((contact, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-slate-100"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl ${contact.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                              >
                                {contact.initials}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-900">
                                    {contact.name}
                                  </span>
                                  {contact.isFavorite && (
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  )}
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${contact.tagColor}`}
                                  >
                                    {contact.tag}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {contact.title} • {contact.company}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium border border-amber-200">
                                ⏰ {contact.followUp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          readOnly
                          value="Filter by name, company, email..."
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-400"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Showing 3 sample records
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sampleContacts.map((c, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div
                              className={`w-10 h-10 rounded-xl ${c.avatarBg} text-white font-bold text-sm flex items-center justify-center`}
                            >
                              {c.initials}
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.tagColor}`}
                            >
                              {c.tag}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                            <p className="text-xs text-slate-500">{c.title}</p>
                            <p className="text-xs text-blue-600 font-medium">{c.company}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                            <p className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.email}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.phone}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'pipeline' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                          <CalendarClock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-900">
                            Upcoming Action Required
                          </p>
                          <p className="text-[11px] text-amber-700">
                            1 critical conversation due today, 2 coming up later this week.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                        Radar Active
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="bg-white p-3.5 rounded-xl border-l-4 border-l-rose-500 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Call Sarah Jenkins (Apex Media)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Review contract draft and onboarding timeline.
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                          Due Today
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border-l-4 border-l-blue-500 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Demo Alex Rivera (Veloce Labs)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Walkthrough API integration & query filters.
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          Tomorrow
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Quarterly Sync Priya Sharma
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Discuss joint partner co-marketing initiative.
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          Next Week
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Engineered For Simplicity
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything your relationships need, nothing you don't.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Traditional CRMs take weeks of onboarding and cost hundreds. Mini-CRM is ready in 30 seconds
            and stays out of your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-200 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.gradient} text-white flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison: The Old Way vs Mini-CRM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Why Switch?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Break free from cluttered spreadsheets and expensive bloat.
            </h2>
            <p className="text-sm text-slate-400">
              See why modern creators, professionals, and small teams prefer Mini-CRM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* The Old Way */}
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <CloseIcon className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base text-white">Traditional CRM & Spreadsheets</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>Messy Excel sheets with missing phone numbers and broken rows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>Costly enterprise software charging $50/user every single month.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>No automated reminders — leads slip through cracks and go cold.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>Confusing multi-tier menus and sluggish 3-second page loads.</span>
                </li>
              </ul>
            </div>

            {/* The Mini-CRM Way */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-5 h-5 shrink-0 stroke-[3]" />
                <h3 className="font-bold text-base text-white">The Mini-CRM Experience</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Clean, unified contact cards with full details, company, notes & tags.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>100% free, lightweight, and open source with instant demo access.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Automated Follow-up Radar with Overdue & Due Today alerts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Sub-second page navigation powered by modern React 18 & Vite.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            How It Works
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Up and running in 3 effortless steps.
          </h2>
          <p className="text-sm text-slate-600">
            You don't need a manual or a multi-day training session. Start nurturing contacts today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">Create Account or Click Demo</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Register in 10 seconds or use the pre-loaded demo admin credentials to test the features instantly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">Add or Import Your Contacts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Add contacts with phone, email, notes, and tags, or import hundreds from an existing CSV file.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-base flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">Schedule & Track Follow-ups</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Assign due dates for meetings, calls, and emails. Let the Follow-up Radar keep you on track.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Got Questions?
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about getting the most out of Mini-CRM.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Conversion CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 lg:p-16 text-white text-center shadow-2xl shadow-blue-500/25">
          <div className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-indigo-900/40 blur-2xl" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ready for better networking?</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start organizing your contacts in seconds.
            </h2>

            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              No credit card required. No complex setup. Experience how enjoyable and efficient
              contact management can truly be.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-bold text-sm rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Go to CRM Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-bold text-sm rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/contact"
                    className="w-full sm:w-auto px-7 py-3.5 bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
                  >
                    Contact Support
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
