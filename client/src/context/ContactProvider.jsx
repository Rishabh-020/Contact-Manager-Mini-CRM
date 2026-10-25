import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/contactApi.js';

export const ContactContext = createContext(null);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used inside ContactProvider');
  }
  return context;
};

// Keeps the contacts of the logged-in user.
// Every change is saved on the server first, then the list is loaded again.
export default function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  };

  // Gets the latest contacts from the server.
  const loadContacts = async () => {
    try {
      setContacts(await api.getAllContacts());
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  useEffect(() => {
    loadContacts().finally(() => setLoading(false));
  }, []);

  // Runs a server action, reloads the list, and shows a message.
  const run = async (action, successMessage, type = 'success') => {
    try {
      const result = await action();
      await loadContacts();
      if (successMessage) showToast(successMessage, type);
      return result;
    } catch (err) {
      showToast(err.message, 'warning');
      return null;
    }
  };

  // The form waits for this, so it can open the new contact.
  const addContact = async (payload) => {
    try {
      const contact = await api.createContact(payload);
      await loadContacts();
      const name = `${contact.firstName} ${contact.lastName || ''}`.trim();
      showToast(`Contact "${name}" added successfully!`);
      return contact;
    } catch (err) {
      showToast(err.message, 'warning');
      throw err;
    }
  };

  const updateContact = (id, changes) =>
    run(() => api.updateContact(id, changes), 'Contact updated successfully!');

  const deleteContact = (id) =>
    run(() => api.deleteContact(id), 'Contact moved to deleted contacts', 'info');

  const restoreContact = (id) =>
    run(() => api.restoreContact(id), 'Contact restored successfully!');

  const permanentDeleteContact = (id) =>
    run(() => api.permanentDeleteContact(id), 'Contact permanently deleted', 'warning');

  const toggleFavorite = (id) => run(() => api.toggleFavorite(id), 'Favourites updated', 'info');

  const resetToSampleData = () =>
    run(() => api.resetDemoContacts(), 'Demo contacts restored to default!');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading your contacts...
      </div>
    );
  }

  const value = {
    contacts,
    activeContacts: contacts.filter((c) => !c.isDeleted),
    deletedContacts: contacts.filter((c) => c.isDeleted),
    searchQuery,
    setSearchQuery,
    addContact,
    updateContact,
    deleteContact,
    restoreContact,
    permanentDeleteContact,
    toggleFavorite,
    resetToSampleData,
    toast,
    showToast,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}