const inquirer = require('inquirer').default;
const { viewBalance, creditAccount, debitAccount } = require('./operations');

function _toNumberInput(value) {
  const normalized = value.toString().trim();
  const num = Number(normalized);
  if (!Number.isFinite(num) || num <= 0) {
    return 'Please enter a positive numeric amount (e.g., 250.50).';
  }
  return true;
}

function _parseAmount(value) {
  const num = Number(value);
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

async function main() {
  let continueFlag = true;
  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'choice',
        message: 'Enter your choice (1-4):',
        validate: (input) => {
          const number = Number(input);
          if (![1, 2, 3, 4].includes(number)) {
            return 'Invalid choice, please select 1-4.';
          }
          return true;
        }
      }
    ]);

    const choice = Number(answer.choice);
    switch (choice) {
      case 1: {
        const balance = viewBalance();
        console.log(`Current balance: ${balance.toFixed(2)}`);
        break;
      }
      case 2: {
        const amountAns = await inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'Enter credit amount:',
            validate: _toNumberInput
          }
        ]);

        const amount = _parseAmount(amountAns.amount);
        const newBalance = creditAccount(amount);
        console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
        break;
      }
      case 3: {
        const amountAns = await inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'Enter debit amount:',
            validate: _toNumberInput
          }
        ]);

        const amount = _parseAmount(amountAns.amount);
        const result = debitAccount(amount);
        if (result.success) {
          console.log(`Amount debited. New balance: ${result.balance.toFixed(2)}`);
        } else {
          console.log(result.message);
        }
        break;
      }
      case 4:
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
