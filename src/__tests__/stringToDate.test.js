import { stringToDate } from '../utils';

describe('stringToDate', () => {
    it('Parses valid short-form periods like JAN-16 is correctly', () =>{
        const result = stringToDate('JAN-16');
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2016);
        expect(result.getMonth()).toBe(0);
    });

    it('Handles different valid months', () =>{
        const months = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
            JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
        };

        Object.entries(months).forEach(([mon, idx]) => {
            const date = stringToDate(`${mon}-23`);
            expect(date.getFullYear()).toBe(2023);
            expect(date.getMonth()).toBe(idx);
        });
    });

    it('Returns * if input is a wilcard', () => {
        const result = stringToDate('*');
        expect(result).toBe('*');
    });

    it('returns null and warns for malformed string', () => {
        console.warn = jest.fn();
        const result = stringToDate('FEB99');
        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalledWith('Invalid period string: FEB99');
    });
});