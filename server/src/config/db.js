// const mongoose = require('mongoose');

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
//   console.log('MongoDB connected');
// };

// module.exports = connectDB;


// A simple "database" made of two JSON files inside server/data/.
// users.json    -> a list of accounts
// contacts.json -> a map: { "<userId>": [ ...contacts of that user ] }

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Creates the folder and the files the first time the server starts.
function setupDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, '{}');
  console.log('Data files ready in server/data');
}

function readFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  setupDataFiles,
  getUsers: () => readFile(USERS_FILE),
  saveUsers: (users) => writeFile(USERS_FILE, users),
  getContactMap: () => readFile(CONTACTS_FILE),
  saveContactMap: (map) => writeFile(CONTACTS_FILE, map),
};