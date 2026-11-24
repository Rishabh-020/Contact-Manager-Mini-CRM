import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  AlertTriangle,
  Home,
  Info,
  HelpCircle,
  ArrowUpRight,
  Download,
  Database
} from "lucide-react";
import { useContacts } from "../../App.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import * as dashboardApi from "../../api/dashboardApi.js";

export default function Settings() {
  const { contacts, activeContacts, deletedContacts, resetToSampleData, showToast } =
    useContacts();
  const { user, logout } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi
      .getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  const handleExportJSONBackup = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(contacts, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `crm_contacts_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded full JSON database backup!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Settings & Database Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account profile, CRM storage statistics, and database backups.
        </p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">User Account</h2>
        <div className="space-y-1.5 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-500">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-semibold text-slate-500">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-semibold text-slate-500">Role:</span>{" "}
            <span className="font-medium text-blue-600">
              {user?.isAdmin ? "Administrator (Demo Admin Account)" : "Standard User"}
            </span>
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* CRM Database Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">CRM Data Overview</h2>
          </div>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Storage: JSON File System
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-400 block mb-0.5">Active Contacts</span>
            <span className="text-lg font-bold text-slate-900">{activeContacts.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-400 block mb-0.5">Target Lists</span>
            <span className="text-lg font-bold text-slate-900">{stats?.metrics?.totalLists || 0}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-400 block mb-0.5">Follow-up Tasks</span>
            <span className="text-lg font-bold text-slate-900">
              {stats?.metrics?.followUps?.total || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-400 block mb-0.5">Activity Logs</span>
            <span className="text-lg font-bold text-slate-900">
              {stats?.metrics?.totalInteractions || 0}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJSONBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full JSON Backup</span>
          </button>

          {user?.isAdmin ? (
            <button
              type="button"
              onClick={resetToSampleData}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer transition-colors"
            >
              Reset to Demo Starter Data (6 Contacts + Lists + Tasks)
            </button>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Sample starter data restoration is available on demo admin account.
            </p>
          )}
        </div>
      </div>

      {/* Help & Public Pages */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Navigation & Public Pages</h2>
        <p className="text-xs text-slate-500">
          Visit the marketing portal, view platform details, or visit public inquiry pages.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            to="/"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-400" />
              <span>Home Landing</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            to="/about"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span>About Platform</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Contact Support</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sign Out?</h3>
              <p className="text-slate-600 text-sm mt-1">
                Are you sure you want to log out of your session?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
