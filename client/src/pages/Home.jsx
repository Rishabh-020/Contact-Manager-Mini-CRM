import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarClock,
  FolderOpen,
  Search,
  UploadCloud,
  Trash2,
  ArrowRight,
  LayoutDashboard,
  Database,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Contact Directory',
      description:
        'Store and manage contacts with detailed records including name, phone, email, company, designation, and notes.',
      badge: 'Core Module',
    },
    {
      icon: CalendarClock,
      title: 'Follow-up Scheduler',
      description:
        'Organize upcoming interactions and client follow-ups with automated Overdue, Today, and Upcoming status badges.',
      badge: 'Reminders',
    },
    {
      icon: FolderOpen,
      title: 'Custom Lists & Tags',
      description:
        'Segment contacts into organized lists with color-coded custom tags to quickly group leads, clients, and partners.',
      badge: 'Organization',
    },
    {
      icon: Search,
      title: 'Instant Live Search',
      description:
        'Filter contacts dynamically across multiple fields (name, email, company, tags) with real-time responsive results.',
      badge: 'Search',
    },
    {
      icon: UploadCloud,
      title: 'CSV Import & Export',
      description:
        'Bulk import contacts from spreadsheet CSV files with auto-mapped fields and download your full directory at any time.',
      badge: 'Data Tools',
    },
    {
      icon: Trash2,
      title: 'Recycle Bin & Restore',
      description:
        'Soft-delete protection ensures accidentally removed contacts can be restored with a single click before permanent removal.',
      badge: 'Data Safety',
    },
  ];

  const techStack = [
    { label: 'Frontend', value: 'React 18 + Vite + Tailwind CSS' },
    { label: 'Backend', value: 'Node.js + Express REST API' },
    { label: 'Database', value: 'MongoDB + Mongoose ODM' },
    { label: 'Authentication', value: 'JWT Stateless + bcryptjs' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Web Development Project</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Mini-CRM Contact & Follow-up Manager
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A full-stack relationship and contact management application built with the MERN stack.
          Designed to manage contacts, schedule follow-ups, and organize records efficiently.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition"
              >
                <span>Demo Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-xs transition"
              >
                <span>Create Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Tech Stack Summary Grid */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {techStack.map((item, i) => (
            <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs text-left">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Core Features</h2>
          <p className="text-sm text-slate-500 mt-1">Key functional modules implemented in this system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Credentials Section for Evaluators */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Pre-configured Demo Account</h3>
            <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">For Evaluators</span>
          </div>
          <p className="text-xs text-slate-300">
            You can sign in with the pre-seeded admin account to test all features with pre-loaded demo contacts:
          </p>
          <div className="bg-slate-800 p-3 rounded-xl font-mono text-xs space-y-1">
            <p><span className="text-slate-400">Email:</span> admin@minicrm.college</p>
            <p><span className="text-slate-400">Password:</span> password123</p>
          </div>
          <div className="pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
