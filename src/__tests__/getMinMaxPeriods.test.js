import { getMinMaxPeriods, stringToDate } from '../utils';

describe ('getMinMaxPeriods', () => {
    const entries = [
        { period: 'FEB-16' },
        { period: 'JAN-16' },
        { period: 'MAR-16' },
    ];

    it('return the correct min an max dates from string periods', () => {
        const { min, max } = getMinMaxPeriods(entries);

        expect(min).toEqual(stringToDate('JAN-16'));
        expect(max).toEqual(stringToDate('MAR-16'));
    });

    it('works with already parde Date objects', () => {
        const entriesWithDates = [
            { period: stringToDate('FEB-16') },
            { period: stringToDate('JAN-16') },
            { period: stringToDate('APR-16') },
        ];

        const { min, max } = getMinMaxPeriods(entriesWithDates);

        expect(min).toEqual(stringToDate('JAN-16'));
        expect(max).toEqual(stringToDate('APR-16'));
    });
});