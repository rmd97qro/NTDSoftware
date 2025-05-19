import { toCSV } from '../utils';

describe ('toCSV', () => {
    const data = [
        {
            ACCOUNT: 1000,
            DESCRIPTION: 'Cash',
            DEBIT: 500,
            CREDIT: 200,
            BALANCE: 300,
        },
        {
            ACCOUNT: 2000,
            DESCRIPTION: 'Revenue',
            DEBIT: 0,
            CREDIT: 800,
            BALANCE: -800,
        },
    ];

    it('generates correct CSV string with headers' , () => {
        const csv = toCSV(data);
        const expected = [
            'ACCOUNT;DESCRIPTION;DEBIT;CREDIT;BALANCE',
            '1000;Cash;500;200;300',
            '2000;Revenue;0;800;-800'
        ].join(';\n');
        
        //Allow ;\n vs ;\n handling differences by trimmingand normalizing
        expect(csv.trim()).toBe(expected.trim());
    });

    it('handles empty array gracefully', () => {
        const csv = toCSV([]);
        expect(csv).toBe('');
    });

    it('handles special characters (e.g. semicolons)', () => {
        const input = [
            {
                ACCOUNT: 3000,
                DESCRIPTION: 'Marketing;Expense',
                DEBIT: 200,
                CREDIT: 0,
                BALANCE: 200,
            }
        ];

        const csv = toCSV(input);
        const lines = csv.split(';\n');
        expect(lines[1]).toContain('Marketing;Expense');
    });
});