const { readBalance, writeBalance } = require('./dataStore');

function _roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function viewBalance() {
  const balance = _roundToTwo(readBalance());
  return balance;
}

function creditAccount(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive number');
  }
  const current = _roundToTwo(readBalance());
  const next = _roundToTwo(current + amount);
  writeBalance(next);
  return next;
}

function debitAccount(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    throw new Error('Debit amount must be a positive number');
  }
  const current = _roundToTwo(readBalance());
  if (current < amount) {
    return { success: false, balance: current, message: 'Insufficient funds for this debit.' };
  }
  const next = _roundToTwo(current - amount);
  writeBalance(next);
  return { success: true, balance: next };
}

module.exports = {
  viewBalance,
  creditAccount,
  debitAccount
};
