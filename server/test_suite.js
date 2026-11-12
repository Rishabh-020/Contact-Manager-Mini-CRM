require('dotenv').config();

const authService = require('./src/services/auth.service');
const contactService = require('./src/services/contact.service');
const listService = require('./src/services/list.service');
const followUpService = require('./src/services/followUp.service');
const interactionService = require('./src/services/interaction.service');
const dashboardService = require('./src/services/dashboard.service');

// Validators
const authValidator = require('./src/validators/auth.validator');
const contactValidator = require('./src/validators/contact.validator');
const dashboardValidator = require('./src/validators/dashboard.validator');
const followUpValidator = require('./src/validators/followUp.validator');
const interactionValidator = require('./src/validators/interaction.validator');
const listValidator = require('./src/validators/list.validator');

async function runSuite() {
  console.log('--- Starting CRM Suite Tests ---');

  // 1. Ensure admin account
  const admin = await authService.ensureAdminAccount();
  console.log('1. Admin account verified:', admin.email);

  // 2. Contacts
  const contactsRes = await contactService.listContacts(admin.id);
  const contacts = contactsRes.contacts;
  console.log('2. Retrieved active contacts:', contacts.length);
  if (contacts.length === 0) throw new Error('No contacts found for admin');

  const testContact = contacts[0];
  const singleContact = await contactService.getContactById(admin.id, testContact.id);
  console.log('3. Single contact fetch:', singleContact.firstName, singleContact.lastName);

  // 3. Lists
  const lists = await listService.getAllLists(admin.id);
  console.log('4. Custom lists count:', lists.length);
  const membership = await listService.getListsForContact(admin.id, testContact.id);
  console.log('5. Contact list memberships:', membership.length);

  // 4. Follow-ups
  const followUps = await followUpService.getAllFollowUps(admin.id);
  console.log('6. Follow-ups count:', followUps.length);

  // Create a new follow-up
  const newFollowUp = await followUpService.createFollowUp(admin.id, {
    contactId: testContact.id,
    title: 'Test Follow Up Suite',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'high',
    notes: 'Testing suite integration'
  });
  console.log('7. Created follow-up:', newFollowUp.id, newFollowUp.contactName);

  // Toggle status
  const toggled = await followUpService.toggleFollowUpStatus(admin.id, newFollowUp.id);
  console.log('8. Toggled follow-up status:', toggled.status);

  // Delete follow-up
  await followUpService.deleteFollowUp(admin.id, newFollowUp.id);
  console.log('9. Deleted test follow-up');

  // 5. Interactions
  const newInter = await interactionService.createInteraction(admin.id, {
    contactId: testContact.id,
    type: 'call',
    date: new Date().toISOString(),
    summary: 'Test Interaction Suite',
    outcome: 'positive'
  });
  console.log('10. Created interaction:', newInter.id, newInter.contactName);

  const contactInteractions = await interactionService.getInteractionsByContact(admin.id, testContact.id);
  console.log('11. Retrieved interactions for contact:', contactInteractions.length);

  await interactionService.deleteInteraction(admin.id, newInter.id);
  console.log('12. Deleted test interaction');

  // 6. Dashboard Stats
  const stats = await dashboardService.getStats(admin.id);
  console.log('13. Dashboard stats generated:');
  console.log('    Total Contacts:', stats.metrics.totalActiveContacts);
  console.log('    Pending Followups:', stats.metrics.followUps.pendingTotal);
  console.log('    Completed Followups:', stats.metrics.followUps.completed);
  console.log('    Top Tags count:', stats.topTags.length);
  console.log('    Recent activities count:', stats.recentActivities.length);

  // 7. Verify all 6 validators
  console.log('14. Testing Validator Suite...');
  
  // Auth validator
  const validReg = authValidator.validateRegisterBody({ name: 'Test User', email: 'test@example.com', password: 'password123' });
  if (!validReg.name || !validReg.email) throw new Error('authValidator failed on valid input');
  try {
    authValidator.validateRegisterBody({ name: '', email: 'bad' });
    throw new Error('authValidator should have failed on invalid input');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  // Contact validator
  const validContact = contactValidator.validateCreateContactBody({ firstName: 'Aarav', email: 'aarav@test.com' });
  if (validContact.firstName !== 'Aarav') throw new Error('contactValidator failed on valid input');
  try {
    contactValidator.validateCreateContactBody({ firstName: '' });
    throw new Error('contactValidator should have failed without firstName');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  // Dashboard validator
  const validDash = dashboardValidator.validateDashboardQueryParams({ timeRange: '30d' });
  if (validDash.timeRange !== '30d') throw new Error('dashboardValidator failed on valid timeRange');
  try {
    dashboardValidator.validateDashboardQueryParams({ timeRange: 'invalid_range' });
    throw new Error('dashboardValidator should have rejected invalid timeRange');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  // Follow-up validator
  const validFollow = followUpValidator.validateCreateFollowUpBody({
    contactId: testContact.id,
    description: 'Call back next Tuesday',
    dueDate: '2026-11-10',
    priority: 'high'
  });
  if (validFollow.priority !== 'high') throw new Error('followUpValidator failed on valid priority');
  try {
    followUpValidator.validateCreateFollowUpBody({ contactId: '' });
    throw new Error('followUpValidator should have rejected empty contactId');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  // Interaction validator
  const validInter = interactionValidator.validateCreateInteractionBody({
    contactId: testContact.id,
    type: 'meeting',
    note: 'Product demonstration call'
  });
  if (validInter.type !== 'meeting') throw new Error('interactionValidator failed on valid type');
  try {
    interactionValidator.validateCreateInteractionBody({ contactId: testContact.id, type: 'invalid_type', note: '' });
    throw new Error('interactionValidator should have rejected invalid interaction type');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  // List validator
  const validList = listValidator.validateCreateListBody({ name: 'Key Accounts', color: 'indigo' });
  if (validList.color !== 'indigo') throw new Error('listValidator failed on valid color');
  try {
    listValidator.validateCreateListBody({ name: '' });
    throw new Error('listValidator should have rejected empty list name');
  } catch (e) {
    if (e.statusCode !== 400) throw e;
  }

  console.log('    All 6 validators successfully tested and passed!');
  console.log('--- ALL SUITE & VALIDATOR TESTS PASSED SUCCESSFULLY (14/14) ---');
}

runSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
