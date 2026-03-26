jest.mock('./dataStore');
const { readBalance, writeBalance } = require('./dataStore');
const { viewBalance, creditAccount, debitAccount } = require('./operations');

describe('operations module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('viewBalance', () => {
    it('returns the current balance', () => {
      readBalance.mockReturnValue(1000.0);
      expect(viewBalance()).toBe(1000.0);
      expect(readBalance).toHaveBeenCalled();
    });

    it('rounds to two decimals', () => {
      readBalance.mockReturnValue(1000.567);
      expect(viewBalance()).toBe(1000.57);
    });

    it('handles zero balance', () => {
      readBalance.mockReturnValue(0);
      expect(viewBalance()).toBe(0);
    });
  });

  describe('creditAccount', () => {
    it('credits a positive amount', () => {
      readBalance.mockReturnValue(1000.0);
      expect(creditAccount(250.5)).toBe(1250.5);
      expect(writeBalance).toHaveBeenCalledWith(1250.5);
    });

    it('rounds result to two decimals', () => {
      readBalance.mockReturnValue(1000.0);
      expect(creditAccount(250.567)).toBe(1250.57);
      expect(writeBalance).toHaveBeenCalledWith(1250.57);
    });

    it('throws on non-positive amount', () => {
      expect(() => creditAccount(0)).toThrow('Credit amount must be a positive number');
      expect(() => creditAccount(-10)).toThrow('Credit amount must be a positive number');
      expect(() => creditAccount(NaN)).toThrow('Credit amount must be a positive number');
      expect(() => creditAccount('abc')).toThrow('Credit amount must be a positive number');
    });
  });

  describe('debitAccount', () => {
    it('debits a valid amount', () => {
      readBalance.mockReturnValue(1000.0);
      expect(debitAccount(250.5)).toEqual({ success: true, balance: 749.5 });
      expect(writeBalance).toHaveBeenCalledWith(749.5);
    });

    it('allows exact balance debit', () => {
      readBalance.mockReturnValue(950.25);
      expect(debitAccount(950.25)).toEqual({ success: true, balance: 0 });
      expect(writeBalance).toHaveBeenCalledWith(0);
    });

    it('rejects insufficient funds', () => {
      readBalance.mockReturnValue(0);
      expect(debitAccount(10)).toEqual({
        success: false,
        balance: 0,
        message: 'Insufficient funds for this debit.'
      });
      expect(writeBalance).not.toHaveBeenCalled();
    });

    it('throws on non-positive amount', () => {
      expect(() => debitAccount(0)).toThrow('Debit amount must be a positive number');
      expect(() => debitAccount(-100)).toThrow('Debit amount must be a positive number');
      expect(() => debitAccount(NaN)).toThrow('Debit amount must be a positive number');
      expect(() => debitAccount('abc')).toThrow('Debit amount must be a positive number');
    });
  });
});
