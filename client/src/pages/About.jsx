import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Layers,
  Server,
  ShieldCheck,
  Database,
  CalendarClock,
  Users,
  FolderOpen,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function About() {
  const { user } = useAuth();

  const techStack = [
    {
      category: 'Frontend Client',
      tech: 'React 18 + Vite',
      desc: 'Single Page Application with client-side routing, modular components, and fast Hot Module Replacement.',
      icon: Code2,
      badge: 'Client',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      category: 'Styling & Design',
      tech: 'Tailwind CSS',
      desc: 'Utility-first CSS framework providing a responsive, clean layout with consistent spacing and typography.',
      icon: Layers,
      badge: 'UI / UX',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      category: 'Backend Server',
      tech: 'Node.js + Express',
      desc: 'RESTful API architecture with structured controllers, services, middleware, and input validators.',
      icon: Server,
      badge: 'REST API',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      category: 'Database & ODM',
      tech: 'MongoDB + Mongoose',
      desc: 'NoSQL document database with strict schema modeling, indexes, and relationship references.',
      icon: Database,
      badge: 'Database',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  const modules = [
    {
      icon: Users,
      title: 'Contact CRUD & Directory',
      desc: 'Complete Create, Read, Update, and Delete operations for contact profiles with phone, email, designation, tags, and notes.',
    },
    {
      icon: CalendarClock,
      title: 'Follow-up Management',
      desc: 'Scheduling system for client follow-ups with automatic categorization into Overdue, Today, and Upcoming records.',
    },
    {
      icon: FolderOpen,
      title: 'Custom Lists & Grouping',
      desc: 'Organize contacts into custom lists with color coding for efficient segmentation and targeted follow-up.',
    },
    {
      icon: FileSpreadsheet,
      title: 'CSV Bulk Operations',
      desc: 'Client-side parsing of CSV files to import bulk records and export directory data into standard CSV format.',
    },
  ];

  const securityFeatures = [
    'bcryptjs password hashing (cost factor 10) for secure credential storage.',
    'Stateless JSON Web Tokens (JWT) with bearer authorization headers.',
    'User-scoped data isolation ensuring each user only accesses their own records.',
    'Input validation middleware on all routes preventing invalid or malicious payloads.',
  ];

  return (
    <div className="space-y-16 py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Academic Project Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Mini-CRM Project
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Developed as a 5th-semester full-stack Web Development mini project. The application demonstrates
          a decoupled architecture with a React Single Page Application and a Node.js/Express RESTful backend backed by MongoDB.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <span>Go to CRM Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <span>Explore Demo Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Technology Stack</h2>
          <p className="text-xs text-slate-500 mt-0.5">Core technologies and libraries powering the application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{tech.category}</p>
                      <h3 className="text-sm font-bold text-slate-900">{tech.tech}</h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tech.badgeColor}`}>
                    {tech.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Functional Modules */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Functional Modules</h2>
          <p className="text-xs text-slate-500 mt-0.5">Implemented software components and user capabilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Data Protection */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Security & Architecture Specifications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityFeatures.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Project Note */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2 text-center">
        <h3 className="text-sm font-bold text-slate-900">Project Evaluation Note</h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
          This system was designed to fulfill the academic requirements of 5th Semester Mini Project evaluation.
          All source files follow a modular, maintainable folder structure with separated routes, controllers, services, and models.
        </p>
      </section>
    </div>
  );
}
