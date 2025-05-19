# Coding Challenge

Your task is to finish the Redux `mapStateToProps` function to a program to help an accountant to get balances from accounting journals.

## Getting started

Install modules by running `npm install` in the command line, then `npm run start`.

## Inputs & Outputs

Journal and Accounts input fields are already parsed and stored in the app's
Redux store.

User input has the following form:

    AAAA BBBB CCC-YY DDD-YY EEE

- AAAA is the starting account (* means first account of source file)
- BBBB is the ending account(* means last account of source file)
- CCC-YY is the first period (* means first period of source file)
- DDD-YY is the last period (* means last period of source file)
- EEE is output format (values can be HTML or CSV).

Examples of user inputs:

    1000 5000 MAR-16 JUL-16 HTML

This user request must output all accounts from acounts starting with "1000" to accounts starting with "5000", from period MAR-16 to JUL-16. Output should be formatted as an HTML table.

![1000 5000 MAR-16 JUL-16 HTML](/example-1.png)

    2000 * * MAY-16 CSV

This user request must output all accounts from accounts starting with "2000" to last account from source file, from first period of file to MAY-16. Output should be formatted as CSV.

![2000 * * MAY-16 CSV](/example-2.png)

## Challenge

Parsing input fields and storing in Redux has already been implemented; it's up to you to filter the journals and accounts to create the balance data set. This code should go into the selector function at the bottom of the BalanceOutput component. The BalanceOutput component expects balance to be an array of objects with the keys: ACCOUNT, DESCRIPTION, DEBIT, CREDIT, and BALANCE.

## Post challenge

After you're done, commit your changes, push to your GitHub and send us a link.

# Journal Entries Filter App

> Full-stack Django + React challenge – completed and extended for production-readiness.  
> **Reto Full-stack Django + React – completado y mejorado para producción.**

---

## 🧾 Project Description 

This app processes a set of accounting journal entries and account definitions. Users can filter results by account and period ranges. Supports both HTML and CSV outputs.

---

## 🧠 Key Features 

- Account range filtering (`startAccount`, `endAccount`)
- Period range filtering with `JAN-16` style parsing
- Wildcard (`*`) supported for dynamic filters
- Period parsing: `"JAN-16"` → JavaScript `Date`
- Output in HTML or downloadable CSV
- Input validation and error resilience

---

## ✅ Improvements Applied 

| Feature               | Description                                                               |
|-----------------------|---------------------------------------------------------------------------|
| 🔁 Dynamic Wildcards  | Uses real min/max values from dataset instead of static Infinity values.  |
| 📅 Date Parsing       | Converts `JAN-16` format to JavaScript `Date`.                            |
| 📤 CSV Output         | Adds clean CSV output and optional download link.                         |
| ⚠️ Input Validation   | Invalid inputs fall back to defaults and log warnings.                    |
| 🧪 Unit Testing       | Comprehensive Jest test suite.                                            |

---

## 🚀 Run Locally 

```bash
# Install dependencies / Instalar dependencias
npm install

# Start dev server / Iniciar servidor de desarrollo
npm start

# Run tests / Ejecutar pruebas
npm test

---

Unit Tests Implemented 

    stringToDate.test.js

    parseUserInput.test.js

    filterJournalEntries.test.js

    toCSV.test.js

    getMinMaxPeriods.test.js

---
Project Structure
src/
├── components/
│   └── BalanceOutput.js
├── __tests__/
│   ├── stringToDate.test.js
│   ├── parseUserInput.test.js
│   ├── filterJournalEntries.test.js
│   ├── toCSV.test.js
│   └── getMinMaxPeriods.test.js
├── utils.js
├── actions/
│   └── index.js

Author: Raúl Mendoza
GITHUB: https://github.com/rmd97qro/NDR