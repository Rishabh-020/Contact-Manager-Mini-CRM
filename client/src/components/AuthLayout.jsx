// import React from "react";
// import AuthStoryVideo from "./AuthStoryVideo.jsx";

// // Two columns on large screens: the video on the left, the form on the right.
// // On small screens only the form shows.
// export default function AuthLayout({ children }) {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 lg:p-8">
//       <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />

//       <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//         <div className="hidden lg:block">
//           <AuthStoryVideo />
//         </div>
//         <div className="w-full max-w-md mx-auto">{children}</div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import AuthStoryVideo from "./AuthStoryVideo.jsx";

// // Split screen like a real website:
// // left half = dark panel with the full video, right half = light page with the form.
// // On small screens only the form shows.
// export default function AuthLayout({ children }) {
//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
//       <div className="hidden lg:block">
//         <AuthStoryVideo />
//       </div>
//       <div className="flex items-center justify-center p-6 sm:p-12">
//         <div className="w-full max-w-sm">{children}</div>
//       </div>
//     </div>
//   );
// }

// AuthLayout.jsx — cohesive hero layout, no video dependency
// Single gradient surface, animated product preview on left, clean form on right

import React, { useEffect, useState } from "react";
import { Sparkles, Users, Star, Bell, Phone, Mail, Building2, ChevronRight } from "lucide-react";

// Animated contact cards that cycle through to show the product
const CONTACTS = [
  { initials: "RM", color: "#6366f1", name: "Rahul Mehta",   company: "Bright Path Technologies", tag: "Lead",      tagColor: "#6366f1", starred: true  },
  { initials: "PK", color: "#0ea5e9", name: "Priya Kapoor",  company: "Vertex Solutions",          tag: "Client",    tagColor: "#10b981", starred: false },
  { initials: "AS", color: "#f59e0b", name: "Arjun Sharma",  company: "Nova Dynamics",             tag: "Prospect",  tagColor: "#f59e0b", starred: true  },
  { initials: "NK", color: "#ec4899", name: "Neha Kulkarni", company: "Quantum Labs",              tag: "Follow-up", tagColor: "#f97316", starred: false },
];

function ContactCard({ contact, visible }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        position: "absolute",
        inset: 0,
      }}
    >
      <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: contact.color }}
        >
          {contact.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-900 truncate">{contact.name}</span>
            {contact.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 truncate">{contact.company}</span>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: contact.tagColor + "18", color: contact.tagColor }}
        >
          {contact.tag}
        </span>
      </div>
    </div>
  );
}

function AnimatedPreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % CONTACTS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-20">
      {CONTACTS.map((c, i) => (
        <ContactCard key={c.initials} contact={c} visible={i === active} />
      ))}
    </div>
  );
}

const STATS = [
  { icon: Users, value: "238", label: "Contacts" },
  { icon: Star,  value: "12",  label: "Favourites" },
  { icon: Bell,  value: "3",   label: "Follow-ups" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/60 flex flex-col">

      {/* Nav */}
      <nav className="flex items-center gap-2.5 px-8 py-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-800 tracking-wide">Mini-CRM</span>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-center">

          {/* ── LEFT: story panel ── */}
          <div className="hidden lg:flex flex-col gap-8 pr-4">

            {/* Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Contact management, simplified
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Every contact,<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  always in reach.
                </span>
              </h2>
              <p className="text-base text-slate-500 leading-relaxed max-w-sm">
                Stop juggling Excel sheets, phone notes, and chats.
                Mini-CRM keeps all your people in one clean place.
              </p>
            </div>

            {/* Animated contact card */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Live preview</p>
              <AnimatedPreview />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT: form card ── */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8">
            {children}
          </div>

        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pb-6">
        © 2026 Mini-CRM · Contacts, favourites and follow-ups in one place
      </p>
    </div>
  );
}