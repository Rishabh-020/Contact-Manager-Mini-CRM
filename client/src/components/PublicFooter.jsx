import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Heart } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Details */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                CRM
              </div>
              <div>
                <span className="font-bold text-base text-white block leading-tight">
                  Mini-CRM
                </span>
                <span className="text-[11px] text-slate-400 block">
                  5th Semester Mini Project
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A full-stack contact management system implemented with React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Project</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Project Feedback</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Register</Link>
              </li>
            </ul>
          </div>

          {/* Quick Demo Credentials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluator Demo
            </h4>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700/60 font-mono text-[11px] space-y-1">
              <p className="text-slate-300">admin@minicrm.college</p>
              <p className="text-slate-400">password123</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Pre-seeded with contacts and follow-ups.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} Mini-CRM Project. Developed for 5th Semester Evaluation.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400 transition">About</Link>
            <Link to="/contact" className="hover:text-slate-400 transition">Contact</Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> using MERN Stack
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
