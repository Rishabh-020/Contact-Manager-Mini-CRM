import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  User,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'Feedback',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Save feedback locally for demonstration
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedMessage('Thank you for your feedback! Your message has been recorded.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        category: 'Feedback',
        subject: '',
        message: '',
      });
    }, 500);
  };

  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Project Feedback</span>
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Feedback & Project Inquiries
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Have suggestions or feedback regarding this mini project? Leave a message below or contact the developer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Project Contact Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Project Details</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Course</p>
                <p className="font-medium text-slate-800">5th Sem Full-Stack Web Development</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Demo Account</p>
                <p className="font-mono text-slate-700">admin@minicrm.college</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {submittedMessage ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">{submittedMessage}</p>
                <button
                  type="button"
                  onClick={() => setSubmittedMessage(null)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden bg-white"
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Suggestion</option>
                    <option value="Academic Evaluation">Academic Evaluation Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Short summary of your message"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your feedback or questions here..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
