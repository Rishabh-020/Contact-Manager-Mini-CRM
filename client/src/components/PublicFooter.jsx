import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Mail,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Highlight */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Ultra-fast, Lightweight & Privacy-First CRM
              </p>
              <p className="text-xs text-slate-400">
                Designed to make contact organization and follow-up tracking painless.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white tracking-tight block leading-tight">
                  Mini-CRM
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Contact Manager
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A minimalist, intuitive relationship management platform. Built to help
              freelancers, entrepreneurs, and teams stay on top of conversations without CRM bloat.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="mailto:support@minicrm.college"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-medium border border-blue-500/30 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Desk</span>
              </Link>
            </div>
          </div>

          {/* Quick Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In / Demo
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* CRM Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              CRM Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard Analytics
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition-colors">
                  Contact Directory
                </Link>
              </li>
              <li>
                <Link to="/follow-ups" className="hover:text-white transition-colors">
                  Follow-up Scheduler
                </Link>
              </li>
              <li>
                <Link to="/lists" className="hover:text-white transition-colors">
                  Lists & Segmentation
                </Link>
              </li>
              <li>
                <Link to="/import" className="hover:text-white transition-colors">
                  CSV Import & Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Demo & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluation & Project
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide block">
                Quick Demo Login
              </span>
              <p className="text-xs text-slate-300 font-mono">
                admin@minicrm.college
              </p>
              <p className="text-xs text-slate-400 font-mono">
                pwd: password123
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 mt-1"
              >
                <span>Instant Sign In</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              Built with React, Vite, Tailwind CSS, Node.js & Express.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Mini-CRM Contact Manager. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-200 transition-colors">
              About Project
            </Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Help & Support
            </Link>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for clean code
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
