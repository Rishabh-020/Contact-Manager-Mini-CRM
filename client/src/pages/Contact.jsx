import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Inbox
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);
  const [error, setError] = useState('');
  const [previousMessages, setPreviousMessages] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Sync form when user logs in/changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Load previous submissions from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('minicrm_contact_submissions');
      if (stored) {
        setPreviousMessages(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCopyEmail = (emailText) => {
    navigator.clipboard.writeText(emailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);

    // Simulate sending message with clean ticket generation
    setTimeout(() => {
      const ticketId = 'CRM-' + Math.floor(10000 + Math.random() * 90000);
      const newSubmission = {
        id: ticketId,
        name: formData.name,
        email: formData.email,
        category: formData.category,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        timestamp: new Date().toLocaleString(),
        status: 'Received (Pending Review)',
      };

      const updated = [newSubmission, ...previousMessages];
      setPreviousMessages(updated);
      try {
        localStorage.setItem('minicrm_contact_submissions', JSON.stringify(updated));
      } catch {
        // ignore
      }

      setSubmittedMessage(newSubmission);
      setSubmitting(false);

      // Reset fields but keep user info
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        category: 'General Inquiry',
        subject: '',
        message: '',
      });
    }, 600);
  };

  const supportFaqs = [
    {
      q: 'How fast do you respond to inquiries?',
      a: 'We monitor incoming messages Monday through Friday. Typical response time is between 2 to 4 hours.',
    },
    {
      q: 'How can I report a bug or suggest a feature?',
      a: 'Choose "Bug Report" or "Feature Request" from the category dropdown above. Be sure to describe the steps to reproduce or your desired workflow.',
    },
    {
      q: 'Where do I find demo credentials for testing?',
      a: 'You can sign in with: Email: admin@minicrm.college, Password: password123. It contains pre-loaded sample contacts and tags.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">
              Contact & Support Desk
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            We'd love to hear from you.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Have questions about Mini-CRM, need assistance, or want to suggest a new feature?
            Drop us a message and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form & History */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
              {submittedMessage ? (
                /* Success Confirmation State */
                <div className="text-center py-6 space-y-5 animate-in fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-mono border border-emerald-200 mb-2">
                      Reference #{submittedMessage.id}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                      Thank you, <strong>{submittedMessage.name}</strong>. We received your note regarding{' '}
                      <em>"{submittedMessage.subject}"</em> and will reply to{' '}
                      <strong>{submittedMessage.email}</strong> shortly.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs text-slate-600 space-y-1.5 max-w-md mx-auto">
                    <p>
                      <strong>Category:</strong> {submittedMessage.category}
                    </p>
                    <p>
                      <strong>Submitted at:</strong> {submittedMessage.timestamp}
                    </p>
                    <p className="line-clamp-2">
                      <strong>Message:</strong> {submittedMessage.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedMessage(null)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                    {user ? (
                      <Link
                        to="/dashboard"
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Return to Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Back to Home
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Fill out the form below and we'll reply to your email address.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Technical Assistance">Technical Assistance</option>
                        <option value="Academic / College Project">Academic / College Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Question about CSV import"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Your Message *
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {formData.message.length} characters
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your question, suggestion, or feedback here in detail..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Previous Submissions Drawer */}
            {previousMessages.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Your Sent Inquiries ({previousMessages.length})
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      showHistory ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showHistory && (
                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {previousMessages.map((msg, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{msg.subject}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold font-mono">
                            {msg.id}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-1">{msg.message}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>{msg.timestamp}</span>
                          <span className="text-emerald-600 font-medium">{msg.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Direct Info Cards & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Channels */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Direct Channels
              </h3>

              <div className="space-y-4">
                {/* Email Box */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Official Support Email
                      </span>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        support@minicrm.college
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Inquiries, feedback & submissions
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail('support@minicrm.college')}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Campus & Office
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      Tech Innovation & Computing Labs
                    </p>
                    <span className="text-[11px] text-slate-500">
                      Dept. of Computer Science & Engineering
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Operating Hours
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      Mon – Fri: 9:00 AM – 6:00 PM IST
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      ⚡ Average response: under 2 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Reminder Card */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-base">Want to test right now?</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                You don't have to wait for an email reply to evaluate the system. Jump right into our
                interactive demo account.
              </p>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs font-mono text-xs text-blue-50 space-y-1">
                <p>Email: admin@minicrm.college</p>
                <p>Pass: password123</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-blue-100 pt-1"
              >
                <span>Go to login page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Support FAQ */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Support Quick FAQs
              </h4>
              <div className="space-y-2">
                {supportFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-100 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3 text-left flex items-center justify-between gap-2 text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            isOpen ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="px-3 pb-3 text-xs text-slate-600 border-t border-slate-50 pt-2 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
