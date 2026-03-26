const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, 'accounting-data.json');
const DEFAULT_BALANCE = 1000.0;

function _ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: DEFAULT_BALANCE }, null, 2), 'utf8');
  }
}

function readBalance() {
  _ensureDataFile();
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(content);
    const value = Number(parsed.balance);
    return Number.isFinite(value) ? value : DEFAULT_BALANCE;
  } catch (err) {
    return DEFAULT_BALANCE;
  }
}

function writeBalance(balance) {
  const safeBalance = Number(balance);
  if (!Number.isFinite(safeBalance)) {
    throw new Error('Invalid balance value');
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify({ balance: safeBalance }, null, 2), 'utf8');
}

module.exports = {
  readBalance,
  writeBalance,
  DEFAULT_BALANCE
};
