const crypto = require('crypto');

// The 6 demo contacts. Only the admin account gets these.
const SAMPLES = [
  { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@techcorp.io', phone: '+91 98765 43210', company: 'TechCorp Solutions', designation: 'Senior Product Manager', tags: ['Lead', 'High Value', 'Product'], notes: 'Discussed Q3 CRM integration. Follow up after budget approval.', isFavorite: true, followUpDate: '2026-10-28', createdAt: '2026-10-15T10:30:00.000Z' },
  { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@cloudforge.com', phone: '+91 98112 34567', company: 'CloudForge Systems', designation: 'Engineering Director', tags: ['Customer', 'Tech'], notes: 'Key decision maker for cloud migration.', isFavorite: true, followUpDate: '2026-10-25', createdAt: '2026-10-18T14:20:00.000Z' },
  { firstName: 'Rohan', lastName: 'Verma', email: 'rohan.verma@nexusai.dev', phone: '+91 99201 88765', company: 'Nexus AI Labs', designation: 'Chief Technology Officer', tags: ['Partner', 'AI'], notes: 'Very receptive to collaborating on the API pipeline.', isFavorite: false, followUpDate: '2026-10-24', createdAt: '2026-10-02T09:15:00.000Z' },
  { firstName: 'Ananya', lastName: 'Deshmukh', email: 'ananya.d@vertexdesign.studio', phone: '+91 97654 32109', company: 'Vertex Design Studio', designation: 'Lead UI/UX Architect', tags: ['Design', 'Client'], notes: 'Needs design sign-off next week.', isFavorite: true, followUpDate: '2026-11-02', createdAt: '2026-10-20T16:45:00.000Z' },
  { firstName: 'Vikram', lastName: 'Singhania', email: 'vikram.s@apexglobal.org', phone: '+91 98334 55667', company: 'Apex Global Logistics', designation: 'Operations VP', tags: ['Lead', 'Operations'], notes: 'Inbound demo inquiry. Needs bulk dispatch integration.', isFavorite: false, followUpDate: '2026-10-22', createdAt: '2026-09-28T11:00:00.000Z' },
  { firstName: 'Neha', lastName: 'Kapoor', email: 'neha.kapoor@finpulse.net', phone: '+91 99887 76655', company: 'FinPulse Advisory', designation: 'Fintech Consultant', tags: ['Customer', 'Finance'], notes: 'Renewed annual consulting retainer.', isFavorite: false, followUpDate: '2026-11-10', createdAt: '2026-10-05T08:00:00.000Z' },
];

// Returns fresh copies of the samples, each with its own id.
function sampleContacts() {
  return SAMPLES.map((sample) => ({
    id: crypto.randomUUID(),
    lastName: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    tags: [],
    notes: '',
    isFavorite: false,
    followUpDate: null,
    ...sample,
    isDeleted: false,
    deletedAt: null,
    updatedAt: sample.createdAt,
  }));
}

function sampleLists(contacts, userId) {
  const contactIds = contacts.map((c) => c.id);
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      userId,
      name: 'Strategic Tech Partners',
      description: 'Key engineering directors and technology partners collaborating on cloud API integrations.',
      color: 'blue',
      contactIds: [contactIds[0], contactIds[1], contactIds[2]].filter(Boolean),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      userId,
      name: 'High Priority Enterprise Leads',
      description: 'Prospects evaluating enterprise procurement and annual software contracts.',
      color: 'purple',
      contactIds: [contactIds[0], contactIds[3], contactIds[4]].filter(Boolean),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function sampleFollowUps(contacts, userId) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  return [
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[0]?.id || '',
      description: 'Follow up on Q3 CRM enterprise integration budget approval.',
      dueDate: todayStr,
      priority: 'high',
      status: 'pending',
      completedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[1]?.id || '',
      description: 'Architecture sync call regarding cloud migration roadmap.',
      dueDate: tomorrowStr,
      priority: 'medium',
      status: 'pending',
      completedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[3]?.id || '',
      description: 'Review UI/UX prototype feedback with design lead.',
      dueDate: nextWeekStr,
      priority: 'low',
      status: 'pending',
      completedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
}

function sampleInteractions(contacts, userId) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[0]?.id || '',
      type: 'call',
      title: 'Phone Consultation',
      note: 'Discussed contract terms and multi-seat team licensing discount.',
      date: yesterday.toISOString(),
      createdAt: yesterday.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[1]?.id || '',
      type: 'meeting',
      title: 'Demo Presentation',
      note: 'Walked through real-time sync architecture and data export capabilities.',
      date: now.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      contactId: contacts[3]?.id || '',
      type: 'email',
      title: 'Design Specs Sent',
      note: 'Dispatched updated responsive Figma tokens and Tailwind color palette.',
      date: yesterday.toISOString(),
      createdAt: yesterday.toISOString(),
    },
  ];
}

module.exports = {
  sampleContacts,
  sampleLists,
  sampleFollowUps,
  sampleInteractions,
};
