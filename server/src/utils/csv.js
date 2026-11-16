// Pure JavaScript RFC 4180 compliant CSV parser and generator.
// Zero external dependencies.

function escapeCSVField(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateCSV(headers, rows) {
  const headerLine = headers.map(escapeCSVField).join(',');
  const rowLines = rows.map((row) => row.map(escapeCSVField).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // ignore carriage return
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) return [];

  const headers = lines[0].map((h) => h.toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || '';
    });
    records.push({ rowNumber: i + 1, data: record });
  }

  return records;
}

module.exports = {
  generateCSV,
  parseCSV,
};

