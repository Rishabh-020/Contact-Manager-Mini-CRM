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

module.exports = { sampleContacts };