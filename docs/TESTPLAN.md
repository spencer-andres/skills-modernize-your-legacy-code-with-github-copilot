# COBOL App Business Logic Test Plan

This test plan validates the current COBOL application workflow and business rules, before/after porting to Node.js.

- Initial account balance in `DataProgram` is 1000.00
- `MainProgram` menu options: 1 (View Balance), 2 (Credit), 3 (Debit), 4 (Exit)
- `Operations` dispatches to `DataProgram` for `READ`/`WRITE` operations

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Results | Actual Result | Status (Pass/Fail) | Comments |
|--------------|-----------------------|----------------|------------|------------------|---------------|--------------------|----------|
| TC-01 | View current balance | App started, initial balance 1000.00 | 1. Select menu option 1 (View Balance) 2. Validate displayed balance | Display: "Current balance: 1000.00" |  |  |  |
| TC-02 | Credit account with valid amount | Current balance 1000.00 | 1. Select option 2 (Credit Account) 2. Input amount 250.50 3. Confirm output | DataProgram READ returns 1000.00, adds 250.50, DataProgram WRITE saves 1250.50; Display: "Amount credited. New balance: 1250.50" |  |  |  |
| TC-03 | Debit account with sufficient funds | Current balance 1250.50 (after TC-02) | 1. Select option 3 (Debit Account) 2. Input amount 300.25 3. Confirm output | DataProgram READ returns 1250.50, subtracts 300.25, DataProgram WRITE saves 950.25; Display: "Amount debited. New balance: 950.25" |  |  |  |
| TC-04 | Debit account with exact balance | Current balance 950.25 | 1. Select option 3 2. Input amount 950.25 3. Confirm output | DataProgram READ returns 950.25, subtracts 950.25, DataProgram WRITE saves 0.00; Display: "Amount debited. New balance: 0.00" |  |  |  |
| TC-05 | Debit account with insufficient funds | Current balance 0.00 | 1. Select option 3 2. Input amount 10.00 3. Confirm output | DataProgram READ returns 0.00, branch to insufficient funds; Display: "Insufficient funds for this debit."; STORAGE-BALANCE remains 0.00 |  |  |  |
| TC-06 | Invalid menu selection handling | App running | 1. Enter invalid option 5 (or 0 or text invalid value) 2. Confirm output | Display: "Invalid choice, please select 1-4." and loop continues, no state changes |  |  |  |
| TC-07 | Exit workflow | App running | 1. Select option 4 (Exit) | CONTINUE-FLAG set to NO, loop terminates, display: "Exiting the program. Goodbye!" |  |  |  |
| TC-08 | Balance persistence over operations | Start at 1000.00 | 1. Credit 100.00 2. View balance 3. Debit 50.00 4. View balance | After credit, 1100.00; after debit, 1050.00; READ always returns latest stored value from DataProgram |  |  |  |

> Notes for stakeholder validation:
>
> - `Actual Result` and `Status` are placeholders for live validation during test execution.
> - For integration path in Node.js, map `MainProgram` menu routes, `Operations` decision rules, and `DataProgram` state store behavior.
