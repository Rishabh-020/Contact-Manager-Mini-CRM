import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';

export const ContactContext = createContext(null);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

const STORAGE_KEY = 'cm_mini_crm_contacts_v1';

const INITIAL_CONTACTS = [
  {
    id: 'cnt-101',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@techcorp.io',
    phone: '+91 98765 43210',
    company: 'TechCorp Solutions',
    designation: 'Senior Product Manager',
    tags: ['Lead', 'High Value', 'Product'],
    notes: 'Discussed Q3 CRM integration. Interested in enterprise tier. Follow up after budget approval meeting.',
    isFavorite: true,
    followUpDate: '2026-10-28',
    createdAt: '2026-10-15T10:30:00.000Z',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 'cnt-102',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@cloudforge.com',
    phone: '+91 98112 34567',
    company: 'CloudForge Systems',
    designation: 'Engineering Director',
    tags: ['Customer', 'Tech', 'Enterprise'],
    notes: 'Key decision maker for cloud migration stack. Requested technical whitepaper and security architecture overview.',
    isFavorite: true,
    followUpDate: '2026-10-25',
    createdAt: '2026-10-18T14:20:00.000Z',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 'cnt-103',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@nexusai.dev',
    phone: '+91 99201 88765',
    company: 'Nexus AI Labs',
    designation: 'Chief Technology Officer',
    tags: ['Partner', 'AI', 'Investor'],
    notes: 'Met at College Tech Symposium. Very receptive to collaborating on backend API pipeline & AI summaries.',
    isFavorite: false,
    followUpDate: '2026-10-24',
    createdAt: '2026-10-02T09:15:00.000Z',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 'cnt-104',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    email: 'ananya.d@vertexdesign.studio',
    phone: '+91 97654 32109',
    company: 'Vertex Design Studio',
    designation: 'Lead UI/UX Architect',
    tags: ['Design', 'Client'],
    notes: 'Working on brand refresh guidelines and mobile UI component kit. Needs design sign-off next week.',
    isFavorite: true,
    followUpDate: '2026-11-02',
    createdAt: '2026-10-20T16:45:00.000Z',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 'cnt-105',
    firstName: 'Vikram',
    lastName: 'Singhania',
    email: 'vikram.s@apexglobal.org',
    phone: '+91 98334 55667',
    company: 'Apex Global Logistics',
    designation: 'Operations VP',
    tags: ['Lead', 'Operations'],
    notes: 'Inbound demo inquiry from landing page. Needs automated notifications and bulk dispatch integration.',
    isFavorite: false,
    followUpDate: '2026-10-22',
    createdAt: '2026-09-28T11:00:00.000Z',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 'cnt-106',
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha.kapoor@finpulse.net',
    phone: '+91 99887 76655',
    company: 'FinPulse Advisory',
    designation: 'Fintech Consultant',
    tags: ['Customer', 'Finance'],
    notes: 'Renewed annual consulting retainer. Very pleased with quarterly review metrics.',
    isFavorite: false,
    followUpDate: '2026-11-10',
    createdAt: '2026-10-05T08:00:00.000Z',
    isDeleted: false,
    deletedAt: null,
  }
];

export default function App() {
  const [contacts, setContacts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse contacts from localStorage', e);
    }
    return INITIAL_CONTACTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Sync contacts with localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.error('Error saving contacts to localStorage', e);
    }
  }, [contacts]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  };

  // Add a new contact
  const addContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: 'cnt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
    showToast(`Contact "${newContact.firstName} ${newContact.lastName || ''}".trim() added successfully!`);
    return newContact;
  };

  // Update an existing contact
  const updateContact = (id, updatedFields) => {
    let updatedContact = null;
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === id) {
          updatedContact = {
            ...contact,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          return updatedContact;
        }
        return contact;
      })
    );
    showToast(`Contact updated successfully!`);
    return updatedContact;
  };

  // Soft delete contact
  const deleteContact = (id) => {
    const target = contacts.find((c) => c.id === id);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() }
          : c
      )
    );
    const name = target ? `${target.firstName} ${target.lastName || ''}`.trim() : 'Contact';
    showToast(`"${name}" moved to deleted contacts`, 'info');
  };

  // Restore deleted contact
  const restoreContact = (id) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isDeleted: false, deletedAt: null } : c
      )
    );
    showToast('Contact restored successfully!');
  };

  // Permanently delete contact
  const permanentDeleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    showToast('Contact permanently deleted', 'warning');
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    let nowFavorite = false;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          nowFavorite = !c.isFavorite;
          return { ...c, isFavorite: nowFavorite };
        }
        return c;
      })
    );
    showToast(nowFavorite ? 'Added to favourites' : 'Removed from favourites', 'info');
  };

  // Reset to initial demo sample contacts
  const resetToSampleData = () => {
    setContacts(INITIAL_CONTACTS);
    showToast('Demo contacts restored to default!', 'success');
  };

  // Computed active contacts (not deleted)
  const activeContacts = useMemo(
    () => contacts.filter((c) => !c.isDeleted),
    [contacts]
  );

  // Computed deleted contacts
  const deletedContacts = useMemo(
    () => contacts.filter((c) => c.isDeleted),
    [contacts]
  );

  // Value passed into context
  const contextValue = {
    contacts,
    activeContacts,
    deletedContacts,
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

  return (
    <ContactContext.Provider value={contextValue}>
      <AppRoutes />
    </ContactContext.Provider>
  );
}

