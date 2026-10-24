import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Contacts from '../pages/Contacts.jsx';
import ContactDetails from '../pages/ContactDetails.jsx';
import ContactForm from '../pages/ContactForm.jsx';
import Lists from '../pages/Lists.jsx';
import FollowUps from '../pages/FollowUps.jsx';
import ImportCSV from '../pages/ImportCSV.jsx';
import DeletedContacts from '../pages/DeletedContacts.jsx';
import Settings from '../pages/Settings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* TODO: wrap in a ProtectedRoute once auth is built */}
      <Route element={<MainLayout />}>
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
    </Routes>
  );
}
