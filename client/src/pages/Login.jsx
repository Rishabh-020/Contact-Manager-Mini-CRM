import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

const DEMO_EMAIL = "admin@minicrm.college";
const DEMO_PASSWORD = "password123";

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

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // After login, GuestOnly sends the user to the dashboard.
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Soft background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white p-8 space-y-6">
          {/* Logo and title */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to manage your contacts.
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
              icon={Mail}
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              icon={Lock}
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 text-white font-semibold text-sm transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={fillDemo}
            className="w-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl py-2.5 transition"
          >
            Use demo admin account
          </button>

          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Sparkles,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   AlertCircle,
// } from "lucide-react";
// import { useAuth } from "../auth/AuthContext.jsx";
// import AuthLayout from "../components/AuthLayout.jsx";

// const DEMO_EMAIL = "admin@minicrm.college";
// const DEMO_PASSWORD = "password123";

// // One input box with an icon on the left.
// function Field({ icon: Icon, label, rightSlot, ...inputProps }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-slate-700 mb-1.5">
//         {label}
//       </label>
//       <div className="relative">
//         <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <input
//           {...inputProps}
//           className="w-full pl-10 pr-11 py-3 text-sm text-slate-900 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
//         />
//         {rightSlot && (
//           <div className="absolute right-2 top-1/2 -translate-y-1/2">
//             {rightSlot}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Login() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await login(email, password);
//       // After login, GuestOnly sends the user to the dashboard.
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const fillDemo = () => {
//     setEmail(DEMO_EMAIL);
//     setPassword(DEMO_PASSWORD);
//     setError("");
//   };

//   return (
//     <AuthLayout>
//       <div className="w-full space-y-6">
//         {/* Logo and title */}
//         <div className="text-center space-y-3">
//           <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
//             <Sparkles className="w-7 h-7" />
//           </div>
//           <div>
//             <h1 className="font-display text-2xl font-bold text-slate-900">
//               Welcome back
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">
//               Sign in to manage your contacts.
//             </p>
//           </div>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
//             <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <Field
//             icon={Mail}
//             label="Email"
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <Field
//             icon={Lock}
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             autoComplete="current-password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             rightSlot={
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((v) => !v)}
//                 className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-4 h-4" />
//                 ) : (
//                   <Eye className="w-4 h-4" />
//                 )}
//               </button>
//             }
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 text-white font-semibold text-sm transition-all"
//           >
//             {loading ? (
//               <>
//                 <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                 <span>Signing in...</span>
//               </>
//             ) : (
//               <>
//                 <span>Sign in</span>
//                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//               </>
//             )}
//           </button>
//         </form>

//         <button
//           type="button"
//           onClick={fillDemo}
//           className="w-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl py-2.5 transition"
//         >
//           Use demo admin account
//         </button>

//         <p className="text-center text-sm text-slate-500">
//           New here?{" "}
//           <Link
//             to="/register"
//             className="font-semibold text-blue-600 hover:text-blue-700"
//           >
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </AuthLayout>
//   );
// }


// Login.jsx — matches the new light AuthLayout perfectly

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
// import { useAuth } from "../auth/AuthContext.jsx";
// import AuthLayout from "../components/AuthLayout.jsx";

// const DEMO_EMAIL    = "admin@minicrm.college";
// const DEMO_PASSWORD = "password123";

// function Field({ icon: Icon, label, rightSlot, ...inputProps }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
//         {label}
//       </label>
//       <div className="relative">
//         <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//         <input
//           {...inputProps}
//           className="w-full pl-10 pr-11 py-3 text-sm text-slate-900 rounded-xl border border-slate-200 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
//         />
//         {rightSlot && (
//           <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Login() {
//   const { login } = useAuth();
//   const [email,        setEmail]        = useState("");
//   const [password,     setPassword]     = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error,        setError]        = useState("");
//   const [loading,      setLoading]      = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await login(email, password);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const fillDemo = () => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); };

//   return (
//     <AuthLayout>
//       <div className="space-y-6">

//         {/* Header */}
//         <div className="space-y-1.5">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 mb-3">
//             <Sparkles className="w-5 h-5 text-white" />
//           </div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
//           <p className="text-sm text-slate-500">Sign in to manage your contacts.</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-700">
//             <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Field
//             icon={Mail} label="Email address" type="email"
//             autoComplete="email" placeholder="you@example.com"
//             value={email} onChange={(e) => setEmail(e.target.value)} required
//           />
//           <Field
//             icon={Lock} label="Password"
//             type={showPassword ? "text" : "password"}
//             autoComplete="current-password" placeholder="Enter your password"
//             value={password} onChange={(e) => setPassword(e.target.value)} required
//             rightSlot={
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((v) => !v)}
//                 className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
//                 aria-label={showPassword ? "Hide" : "Show"}
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             }
//           />

//           <div className="pt-1">
//             <button
//               type="submit" disabled={loading}
//               className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-200"
//             >
//               {loading ? (
//                 <>
//                   <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   <span>Signing in…</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Sign in</span>
//                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Divider */}
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-100" />
//           </div>
//           <div className="relative flex justify-center">
//             <span className="bg-white px-3 text-xs text-slate-400">or</span>
//           </div>
//         </div>

//         {/* Demo */}
//         <button
//           type="button" onClick={fillDemo}
//           className="w-full text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 transition"
//         >
//           Use demo admin account
//         </button>

//         {/* Register link */}
//         <p className="text-center text-sm text-slate-500">
//           New here?{" "}
//           <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
//             Create an account
//           </Link>
//         </p>

//       </div>
//     </AuthLayout>
//   );
// }