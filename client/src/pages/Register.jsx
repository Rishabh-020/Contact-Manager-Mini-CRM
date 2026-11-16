// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext.jsx";

// export default function Register() {
//   const { register } = useAuth();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirm) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await register(name, email, password);
//       // After register, GuestOnly sends the new user to the dashboard.
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
//           <p className="text-xs text-slate-500 mt-1">
//             Your new account starts with no contacts.
//           </p>
//         </div>

//         {error && (
//           <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Full Name
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Password (min 6 characters)
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl"
//           >
//             {loading ? "Creating account..." : "Create account"}
//           </button>
//         </form>

//         <p className="text-center text-xs text-slate-500">
//           Already registered?{" "}
//           <Link to="/login" className="text-blue-600 font-semibold">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

// One input box with an icon on the left.
function Field({ icon: Icon, label, rightSlot, ...inputProps }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          {...inputProps}
          className="w-full pl-10 pr-11 py-3 text-sm text-slate-900 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
        />
        {rightSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

// Gives a password score from 0 to 4 (length, capitals, numbers, symbols).
function passwordScore(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-slate-200",
  "bg-rose-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
];

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = password ? Math.max(1, passwordScore(password)) : 0;
  const passwordsMatch = confirm.length > 0 && confirm === password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // After register, GuestOnly sends the new user to the dashboard.
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Soft background shapes */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-3 flex items-center justify-between px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              Support
            </Link>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white p-8 space-y-6">
          {/* Logo and title */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Start with an empty contact list.
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              icon={User}
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Kunal Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Field
              icon={Mail}
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <Field
                icon={Lock}
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          step <= score
                            ? STRENGTH_COLORS[score]
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Strength:{" "}
                    <span className="font-semibold">
                      {STRENGTH_LABELS[score]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Field
                icon={Lock}
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {passwordsMatch && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 text-white font-semibold text-sm transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}