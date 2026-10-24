import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

// Pages import useContacts from this file, so keep this export here.
export { ContactContext, useContacts } from "./context/ContactProvider.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
