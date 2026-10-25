import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

// Only logged-in users can open the pages inside this route.
// Logged-out users are sent to the login page.
export function RequireAuth() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Login and register pages. Logged-in users are always sent to the dashboard.
export function GuestOnly() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
