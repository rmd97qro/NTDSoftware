export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const setAccounts = accounts => ({
  type: SET_ACCOUNTS,
  payload: accounts
});


export const SET_JOURNAL_ENTRIES = 'SET_JOURNAL_ENTRIES';

export const setJournalEntries = journalEntries => ({
  type: SET_JOURNAL_ENTRIES,
  payload: journalEntries
});


export const SET_USER_INPUT = 'SET_USER_INPUT';

export const setUserInput = userInput => ({
  type: SET_USER_INPUT,
  payload: userInput
});

//New function added to resolve the point about filter logic.
import { getMinMaxAccounts, getMinMaxPeriods, stringToDate } from "../utils";

export const filterJournalEntries = (accounts, journalEntries, userInput) => {
  const { min: minAccountId, max: maxAccountId } = getMinMaxAccounts(accounts);
  const { min: minPeriod, max: maxPeriod } = getMinMaxPeriods(journalEntries);

  const startAccount = isNaN(userInput.startAccount) || userInput.startAccount === '*'
    ? minAccountId
    : Number(userInput.startAccount);

  const endAccount = isNaN(userInput.endAccount) || userInput.endAccount === '*'
    ? maxAccountId
    : Number(userInput.endAccount);

  const startPeriod = !userInput.startPeriod || userInput.startPeriod === '*'
    ? minPeriod
    :userInput.startPeriod;

  const endPeriod = !userInput.endPeriod || userInput.endPeriod === '*'
    ? maxPeriod
    : userInput.endPeriod;

  return journalEntries.filter(entry => {
    const entryAccount = entry.account;
    const entryPeriod = typeof entry.period === 'string' ? stringToDate(entry.period) : entry.period;

    const inAccountRange = entryAccount >= startAccount && entryAccount <= endAccount;
    const inPeriodRange = entryPeriod >= startPeriod && entryPeriod <= endPeriod;

    return inAccountRange && inPeriodRange;
  })
}