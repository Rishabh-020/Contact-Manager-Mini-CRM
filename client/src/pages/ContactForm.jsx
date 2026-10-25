import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Tag,
  Calendar,
  FileText,
  Star,
  Check,
  AlertCircle,
  Save,
  Plus,
  X,
} from "lucide-react";
import { useContacts } from "../App.jsx";

const SUGGESTED_TAGS = [
  "Lead",
  "Customer",
  "Partner",
  "Enterprise",
  "Tech",
  "Design",
  "High Value",
  "Follow-up",
];

export default function ContactForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { contacts, addContact, updateContact } = useContacts();

  // Form Stateḍ
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    tags: [],
    notes: "",
    isFavorite: false,
    followUpDate: "",
  });

  const [newTagInput, setNewTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // If edit mode, load existing contact
  useEffect(() => {
    if (isEditMode) {
      const existing = contacts.find((c) => c.id === id);
      if (existing) {
        setFormData({
          firstName: existing.firstName || "",
          lastName: existing.lastName || "",
          email: existing.email || "",
          phone: existing.phone || "",
          company: existing.company || "",
          designation: existing.designation || "",
          tags: Array.isArray(existing.tags) ? [...existing.tags] : [],
          notes: existing.notes || "",
          isFavorite: Boolean(existing.isFavorite),
          followUpDate: existing.followUpDate || "",
        });
      } else {
        setNotFound(true);
      }
    }
  }, [id, isEditMode, contacts]);

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user types in that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Add tag
  const handleAddTag = (tagToAdd) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setNewTagInput("");
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // 1. First name required
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // 2. Email format validation (if provided)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email =
          "Please enter a valid email address (e.g. name@example.com).";
      }
    }

    // 3. Phone format validation (if provided)
    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.trim().replace(/[\s\-\(\)\+]/g, "");
      if (cleanPhone.length < 7 || !/^\d+$/.test(cleanPhone)) {
        newErrors.phone =
          "Please enter a valid phone number with at least 7 digits.";
      }
    }

    // 4. Duplicate prevention check
    if (formData.email.trim()) {
      const duplicateEmail = contacts.find(
        (c) =>
          !c.isDeleted &&
          c.id !== id &&
          c.email &&
          c.email.trim().toLowerCase() === formData.email.trim().toLowerCase(),
      );
      if (duplicateEmail) {
        newErrors.email = `A contact with email "${formData.email.trim()}" already exists (${duplicateEmail.firstName} ${duplicateEmail.lastName || ""}).`;
      }
    }

    if (formData.phone.trim()) {
      const duplicatePhone = contacts.find(
        (c) =>
          !c.isDeleted &&
          c.id !== id &&
          c.phone &&
          c.phone.trim().replace(/[\s\-\(\)\+]/g, "") ===
            formData.phone.trim().replace(/[\s\-\(\)\+]/g, ""),
      );
      if (duplicatePhone) {
        newErrors.phone = `A contact with this phone number already exists (${duplicatePhone.firstName} ${duplicatePhone.lastName || ""}).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent accidental duplicate submissions
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      designation: formData.designation.trim(),
      notes: formData.notes.trim(),
      followUpDate: formData.followUpDate || null,
    };

    try {
      if (isEditMode) {
        updateContact(id, payload);
        navigate(`/contacts/${id}`);
      } else {
        const created = await addContact(payload);
        navigate(`/contacts/${created.id}`);
      }
    } catch (err) {
      console.error("Submission failed", err);
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Contact Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested contact could not be found or may have been deleted.
        </p>
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header / Back link */}
      <div className="flex items-center justify-between">
        <Link
          to={isEditMode ? `/contacts/${id}` : "/contacts"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEditMode ? "Back to Contact" : "Back to Contacts"}</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          {isEditMode ? `Editing ID: ${id.slice(0, 8)}` : "New CRM Entry"}
        </span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h1 className="text-xl font-display font-bold text-slate-900">
            {isEditMode ? "Edit Contact Details" : "Add New Contact"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {isEditMode
              ? "Update the profile, tags, contact info, or follow-up status."
              : "Fill in the information below to register a new contact in your CRM."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
          {/* Section: Basic Identity */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name (Required) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-hidden ${
                    errors.firstName
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Channels</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aarav.sharma@example.com"
                    className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-hidden ${
                      errors.email
                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-hidden ${
                      errors.phone
                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Company & Role */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Professional Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, Infosys, TechCorp"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tags & Follow-up */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags & Scheduling</span>
            </h2>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tags & Categorization
              </label>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2 min-h-[32px]">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-500 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <span className="text-xs text-slate-400 italic">
                    No tags selected yet
                  </span>
                )}
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(newTagInput);
                    }
                  }}
                  placeholder="Type a tag and press Enter..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(newTagInput)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                <span className="text-[11px] text-slate-400 mr-1">
                  Suggestions:
                </span>
                {SUGGESTED_TAGS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddTag(sug)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Follow-up Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Reminder Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  CRM will highlight this contact when the date is upcoming or
                  due.
                </p>
              </div>

              {/* Favourite Status Checkbox */}
              <div className="flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Priority Status
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="isFavorite"
                    checked={formData.isFavorite}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <Star
                      className={`w-4 h-4 ${
                        formData.isFavorite
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-400"
                      }`}
                    />
                    <span>Mark as Favourite Contact</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Notes & Background</span>
            </h2>

            <div>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add meeting notes, deal context, background information, or action items..."
                className="w-full p-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden resize-y"
              ></textarea>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(isEditMode ? `/contacts/${id}` : "/contacts")
              }
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs shadow-blue-600/30 transition-all hover:shadow-md ${
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "active:scale-[0.98]"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Saving Contact..."
                  : isEditMode
                    ? "Update Contact"
                    : "Save Contact"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
