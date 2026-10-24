import React, { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { useContacts } from "../App.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Settings() {
  const { contacts, activeContacts, deletedContacts, resetToSampleData } =
    useContacts();
  const { user, logout } = useAuth();

  // Controls whether the logout popup is shown.
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Account</h2>
        <p className="text-sm text-slate-700">
          <span className="font-semibold">Name:</span> {user?.name}
        </p>
        <p className="text-sm text-slate-700">
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        <p className="text-sm text-slate-700">
          <span className="font-semibold">Type:</span>{" "}
          {user?.isAdmin ? "Admin (demo account)" : "Normal user"}
        </p>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Contacts</h2>
        <p className="text-sm text-slate-700">
          {activeContacts.length} active, {deletedContacts.length} in trash (
          {contacts.length} total)
        </p>
        {user?.isAdmin ? (
          <button
            type="button"
            onClick={resetToSampleData}
            className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl"
          >
            Restore the 6 sample contacts
          </button>
        ) : (
          <p className="text-xs text-slate-500">
            Sample contacts are only for the demo admin. Add your own contacts
            from the Contacts page.
          </p>
        )}
      </div>

      {/* Logout confirmation popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Log out?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
