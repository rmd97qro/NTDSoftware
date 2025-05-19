import { parseUserInput, partseUserInput } from '../utils';

describe ('parseUserInput', () => {
    it('parses valid input with numbers and dates', () => {
        const input = '1000 2000 JAN-16 FEB-16 HTML';
        const result = parseUserInput(input);

    expect(result.startAccount).toBe(1000);
    expect(result.endAccount).toBe(2000);
    expect(result.startPeriod).toBeInstanceOf(Date);
    expect(result.endPeriod).toBeInstanceOf(Date);
    expect(result.format).toBe('HTML');
    });

    it('handles wildcards correctly', () => {
        const input = '* * * * CSV';
        const result = parseUserInput(input);

        expect(result.startAccount).toBe('*');
        expect(result.endAccount).toBe('*');
        expect(result.startPeriod).toBe('*');
        expect(result.endPeriod).toBe('*');
        expect(result.format).toBe('CSV');
    });

    it('returns default format HTML when missing or invalid', () => {
        const input1 = '1000 2000 JAN-16 FEB-16';  // no format
        const input2 = '1000 2000 JAN-16 FEB-16 xlsx'; //ubnsupported format

        expect(parseUserInput(input1).format).toBe('HTML');
        expect(parseUserInput(input2).format).toBe('HTML');
    });

    it('handles invalid account numbers as wildcards', () => {
        const input = 'abc def JAN-16 FEB-16 HTML';
        const result = parseUserInput(input);

        expect(result.startAccount).toBe('*');
        expect(result.endAccount).toBe('*');
    });

    it('logs warning for invalid periods', () => {
        console.warn = jest.fn(); // mock warn

        const input = '* * XX16 J@N99 CSV';
        const result = parseUserInput(input);

        expect(console.warn).toHaveBeenCalledWith('Invalid period string: XX16');
        expect(console.warn).toHaveBeenCalledWith('Invalid period string: J@N99');
        expect(result.startPeriod).toBeNull();
        expect(result.endPeriod).toBeNull();
    });
});