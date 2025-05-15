import {filterJournalEntries } from '../actions';
import { stringToDate } from '../utils';

describe(filterJournalEntries, () => {
    const accounts = [
        {id: 1000, description: 'Cash' },
        {id: 2000, description: 'Notes Payables'},
        {id: 3000, description: 'Common Stock'},
    ];

    const journalEntries = [
        { account: 1000, period: 'JAN-16', debit: 100, credit: 0},
        { account: 2000, period: 'FEB-16', debit: 0, credit: 50},
        { account: 3000, period: 'MAR-16', debit: 200, credit: 100},
        { account: 1000, period: 'JAN-16', debit: 100, credit: 0},
    ];

    it('uses dynamic min/max when filters are *', () => {
        const userInput = {
            startAccount: '*',
            endAccount: '*',
            startPeriod: '*',
            endPeriod: '*'
        };

        const result = filterJournalEntries(accounts, journalEntries, userInput);
        expect(result.length).toBe(4);  // should include all entries
    });

    it('filters by account range only', () => {
        const userInput = {
            startAccount: 1000,
            endAccount: 2000,
            startPeriod: '*',
            endPeriod: '*',
        };
        
        const result = filterJournalEntries(accounts, journalEntries, userInput);
        expect(result.length).toBe(3);
        for(const entry of result) {
            expect(entry.account).toBeGreaterThanOrEqual(1000);
            expect(entry.account).toBeLessThanOrEqual(2000);
        }
    });

    it('filters by periodo range only', () => {
        const userInput = {
            startAccount: '*',
            endAccount: '*',
            startPeriod: stringToDate('FEB-16'),
            endPeriod: stringToDate('MAR-16'),
        };

        const result = filterJournalEntries(accounts, journalEntries, userInput);

        const periodString = result.map(entry => {
            const date = typeof entry.period === 'string' ? stringToDate(entry.period) : entry.period;
            return `${date.getFullYear()}-${date.getMonth() + 1}`; 
        });
        
        expect(periodString).toEqual(expect.arrayContaining(['2016-2', '2016-3']));
        expect(result.length).toBe(2);
    });
});