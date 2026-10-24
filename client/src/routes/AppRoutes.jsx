import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import ContactProvider from "../context/ContactProvider.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { RequireAuth, GuestOnly } from "./ProtectedRoute.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Contacts from "../pages/Contacts.jsx";
import ContactDetails from "../pages/ContactDetails.jsx";
import ContactForm from "../pages/ContactForm.jsx";
import Lists from "../pages/Lists.jsx";
import FollowUps from "../pages/FollowUps.jsx";
import ImportCSV from "../pages/ImportCSV.jsx";
import DeletedContacts from "../pages/DeletedContacts.jsx";
import Settings from "../pages/Settings.jsx";

// Loads the contacts of the logged-in user.
// The key makes React load fresh data when a different user logs in.
function UserDataLayout() {
  const { user } = useAuth();
  return (
    <ContactProvider key={user.id}>
      <MainLayout />
    </ContactProvider>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<UserDataLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/new" element={<ContactForm />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/contacts/:id/edit" element={<ContactForm />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/import" element={<ImportCSV />} />
          <Route path="/deleted" element={<DeletedContacts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
