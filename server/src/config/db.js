const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const INTERACTIONS_FILE = path.join(DATA_DIR, 'interactions.json');
const LISTS_FILE = path.join(DATA_DIR, 'lists.json');
const FOLLOWUPS_FILE = path.join(DATA_DIR, 'followups.json');

// Creates the folder and the files the first time the server starts.
function setupDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, '{}');
  if (!fs.existsSync(INTERACTIONS_FILE)) fs.writeFileSync(INTERACTIONS_FILE, '{}');
  if (!fs.existsSync(LISTS_FILE)) fs.writeFileSync(LISTS_FILE, '{}');
  if (!fs.existsSync(FOLLOWUPS_FILE)) fs.writeFileSync(FOLLOWUPS_FILE, '{}');
  console.log('Data files ready in server/data');
}

function readFile(file, defaultValue = {}) {
  try {
    if (!fs.existsSync(file)) return defaultValue;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return defaultValue;
  }
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  setupDataFiles,
  getUsers: () => readFile(USERS_FILE, []),
  saveUsers: (users) => writeFile(USERS_FILE, users),
  getContactMap: () => readFile(CONTACTS_FILE, {}),
  saveContactMap: (map) => writeFile(CONTACTS_FILE, map),
  getInteractionMap: () => readFile(INTERACTIONS_FILE, {}),
  saveInteractionMap: (map) => writeFile(INTERACTIONS_FILE, map),
  getListMap: () => readFile(LISTS_FILE, {}),
  saveListMap: (map) => writeFile(LISTS_FILE, map),
  getFollowUpMap: () => readFile(FOLLOWUPS_FILE, {}),
  saveFollowUpMap: (map) => writeFile(FOLLOWUPS_FILE, map),
};
