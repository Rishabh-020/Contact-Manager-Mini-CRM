import React from 'react';
import {
  Settings as SettingsIcon,
  RefreshCw,
  Trash2,
  Download,
  Database,
  Code2,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useContacts } from '../App.jsx';

export default function Settings() {
  const {
    contacts,
    activeContacts,
    deletedContacts,
    resetToSampleData,
    showToast
  } = useContacts();

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(contacts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mini_crm_contacts_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Contacts exported to JSON file!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              CRM Preferences & Settings
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage local browser storage, demo data, and project presentation configurations.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Data Management */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-display font-bold text-slate-900">
              Storage & Data Controls
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">Total Records</span>
                <span className="text-xs text-slate-500">
                  {activeContacts.length} active, {deletedContacts.length} in trash
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {contacts.length} total
              </span>
            </div>

            <div className="pt-2 space-y-2.5">
              {/* Reset to Demo Samples */}
              <button
                type="button"
                onClick={resetToSampleData}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Restore Demo Sample Contacts</span>
                </div>
                <span className="text-[11px] text-blue-500">6 preset contacts</span>
              </button>

              {/* Export JSON */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Export CRM Contacts (JSON)</span>
                </div>
                <span className="text-[11px] text-slate-400">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Presentation Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-display font-bold text-slate-900">
              Project Presentation Details
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Project:</span>
              <span className="font-semibold text-slate-800">Contact Manager Mini-CRM</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Tech Stack:</span>
              <span className="font-medium text-slate-800">React 18 + Vite + Tailwind CSS</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Routing:</span>
              <span className="font-medium text-slate-800">React Router v6</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Persistence:</span>
              <span className="font-medium text-emerald-600">HTML5 Local Storage</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Icon Library:</span>
              <span className="font-medium text-slate-800">Lucide React</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

