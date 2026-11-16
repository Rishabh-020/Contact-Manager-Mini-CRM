import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  CalendarClock,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  Layers,
  Heart,
  CheckCircle2,
  ArrowRight,
  Server,
  Cpu,
  Globe,
  Award,
  Terminal,
  FileSpreadsheet,
  FolderOpen,
  Mail,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function About() {
  const { user } = useAuth();

  const principles = [
    {
      icon: Zap,
      title: 'Radical Simplicity',
      desc: 'No confusing 50-field setup forms or nested sub-menus. Everything you need is reachable in two clicks or fewer.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      icon: CalendarClock,
      title: 'Actionable Follow-ups',
      desc: 'Contacts without follow-up reminders get lost. We put proactive reminder schedules at the heart of the experience.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      icon: ShieldCheck,
      title: 'Data Privacy & Isolation',
      desc: 'Your contacts belong exclusively to your account with secure token authentication and separated storage partitions.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: FileSpreadsheet,
      title: 'Zero Vendor Lock-in',
      desc: 'Seamlessly import from or export to standard CSV at any time. Your network data is always 100% portable.',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  const techStack = [
    {
      category: 'Frontend Client',
      tech: 'React 18 + Vite',
      desc: 'Blazing fast HMR, reactive component hierarchy, and optimized production builds.',
      icon: Code2,
      badge: 'Client',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      category: 'Styling & Design',
      tech: 'Tailwind CSS + Lucide Icons',
      desc: 'Curated modern color scheme, typography pairing (Inter & Plus Jakarta Sans), and fluid layouts.',
      icon: Layers,
      badge: 'UI / UX',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      category: 'Backend Server',
      tech: 'Node.js + Express',
      desc: 'RESTful API architecture with modular routers, controllers, and centralized error handling.',
      icon: Server,
      badge: 'REST API',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      category: 'Security & Auth',
      tech: 'JWT + bcryptjs',
      desc: 'Stateless JSON Web Tokens with password hashing and protected route boundaries.',
      icon: ShieldCheck,
      badge: 'Security',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  const audience = [
    {
      title: 'Freelancers & Consultants',
      description: 'Keep track of client deliverables, contract renewal dates, and invoice follow-ups.',
    },
    {
      title: 'Startups & Small Teams',
      description: 'Nurture sales leads and early adopters without paying $50/month per seat.',
    },
    {
      title: 'Sales & BD Representatives',
      description: 'Color-coded Follow-up Radar guarantees warm leads never turn cold.',
    },
    {
      title: 'Students & Developers',
      description: 'Reference implementation of a full-stack, clean-architecture MERN/REST system.',
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">
              Our Vision & Philosophy
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            We believe relationship management should be{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              refreshingly simple.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Mini-CRM was born out of frustration with overly bloated enterprise software. We stripped
            away the unnecessary noise to give you a clean, fast workspace focused on what actually
            matters: your contacts and conversations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 shadow-xs transition-all"
              >
                <span>Back to CRM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 shadow-xs transition-all"
              >
                <span>Explore Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Genesis
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 leading-snug">
              Why build another CRM in 2026?
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Most modern CRMs were built for Fortune 500 sales teams with hundreds of complex stages,
                mandatory fields, and dense dashboards. For individuals and growing teams, using them
                feels like doing your taxes just to write down someone’s phone number.
              </p>
              <p>
                We built <strong>Mini-CRM</strong> with one mission: make contact management lightweight,
                instantaneous, and pleasant. You can add a contact in 5 seconds, attach notes, schedule a
                follow-up reminder, and get on with your day.
              </p>
              <p>
                Developed originally as a rigorous full-stack semester project, it has grown into a
                comprehensive platform combining React, Node.js, Express, and modern UI engineering.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20 space-y-6">
              <h3 className="font-display text-2xl font-bold">
                The Mini-CRM Promise
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Under 1-second load times</h4>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Zero heavy tracker scripts or slow third-party widgets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Follow-up radar by default</h4>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Color-coded badges spotlight who you promised to contact today.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Total data portability</h4>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Export your entire contact book to RFC-compliant CSV anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Safe recycle bin</h4>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Accidental clicks are never permanent; recover deleted contacts with ease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Principles Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Core Values
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            What guides our product decisions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border ${item.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Full-Stack Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Engineered with modern, production-grade tools.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed as a clean decoupled system: a reactive Single Page Application frontend
              communicating with a robust RESTful Node/Express backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tech.badgeColor}`}>
                      {tech.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {tech.category}
                    </h4>
                    <p className="text-base font-bold text-white mt-0.5">{tech.tech}</p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who is Mini-CRM for? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Tailored For You
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Built for people who value their time.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audience.map((aud, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-slate-900">{aud.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{aud.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator & Project Note Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg shadow-slate-200/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Project Background
                </h3>
                <p className="text-xs text-slate-500">
                  Semester 5 Full-Stack Backend & CRM Application
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Active Project
            </span>
          </div>

          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              This application was developed as a clean-architecture showcase highlighting how modern
              web standards (React 18, React Router v7, Node, Express, Tailwind CSS) can solve real-world
              usability challenges in relationship management.
            </p>
            <p>
              Every detail — from multi-field instant search to the color-coded follow-up alerts and
              reusable layouts — was created with human-first design in mind.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Developer / Team</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
