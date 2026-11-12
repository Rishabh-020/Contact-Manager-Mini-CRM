import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  Upload
} from 'lucide-react';
import { useContacts } from '../../App.jsx';

export default function ImportCSV() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { addContact, showToast } = useContacts();

  const [csvText, setCsvText] = useState(
    `firstName,lastName,email,phone,company,designation,tags
Aditya,Roy,aditya.roy@innovate.co,+91 98223 34455,Innovate Labs,Solutions Architect,Lead;Enterprise
Meera,Nair,meera.nair@quantum.tech,+91 97112 23344,Quantum Tech,Head of Product,Customer;Tech`
  );
  const [fileName, setFileName] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCsvText(content);
        showToast(`Loaded ${file.name} successfully!`, 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      setImporting(true);
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) {
        showToast('Please provide a valid CSV with headers and rows.', 'warning');
        setImporting(false);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      let added = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map((v) => v.trim());
        const row = {};
        headers.forEach((h, index) => {
          row[h] = values[index] || '';
        });

        const fName = row.firstname || row['first name'] || row.first_name;
        if (fName) {
          const lName = row.lastname || row['last name'] || row.last_name || '';
          const tags = (row.tags || '').split(';').map((t) => t.trim()).filter(Boolean);

          try {
            await addContact({
              firstName: fName,
              lastName: lName,
              email: row.email || '',
              phone: row.phone || '',
              company: row.company || '',
              designation: row.designation || row.role || '',
              tags: tags.length > 0 ? tags : ['Imported'],
              notes: 'Imported via CSV batch processor.',
              isFavorite: false,
              followUpDate: null,
            });
            added++;
          } catch (itemErr) {
            console.warn('Skipping row due to error:', itemErr.message);
          }
        }
      }

      setImportCount(added);
      showToast(`Successfully imported ${added} contacts from CSV!`);
      setTimeout(() => navigate('/contacts'), 1200);
    } catch (e) {
      console.error(e);
      showToast('Error parsing CSV. Please check formatting.', 'warning');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                Import Contacts from CSV
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Upload or paste a comma-separated list of contacts to batch import directly into your CRM.
              </p>
            </div>
          </div>

          <Link
            to="/contacts"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        {/* File Drag / Select Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            {fileName ? `Selected file: ${fileName}` : 'Click to upload a .csv file from your computer'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports standard CSV format with column headers.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Or Paste / Edit CSV Data Directly:
          </label>
          <textarea
            rows="8"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Expected headers: <code>firstName,lastName,email,phone,company,designation,tags</code> (tags separated by semicolon).
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {csvText.trim().split('\n').length - 1} rows detected
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={importing}
              onClick={handleImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{importing ? 'Importing Batch...' : 'Process & Import Contacts'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
