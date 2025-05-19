export const stringToDate = str => {
  if (str === '*') return '*';

  const MONTHS = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3,
    MAY: 4, JUN: 5, JUL: 6, AUG: 7,
    SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };

  const [monthStr, yearStr] = str.toUpperCase().split('-');

  if(!MONTHS.hasOwnProperty(monthStr) || isNaN(yearStr)) {
    console.warn(`Invalid period string: ${str}`);
    return null;
  }

  const month = MONTHS[monthStr];
  const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);

  return new Date(year, month, 1);
 
};

export const dateToString = d => {
  if (isNaN(d.valueOf())) {
    return '*';
  }

  const [_, month, __, year] = d.toString().split(' ');
  return `${month.toUpperCase()}-${year.slice(2, 4)}`
}

export const parseCSV = str => {
  let [headers, ...lines] = str.split(';\n');

  headers = headers.split(';');

  return lines.map(line => {
    return line
      .split(';')
      .reduce((acc, value, i) => {
        if (['ACCOUNT', 'DEBIT', 'CREDIT'].includes(headers[i])) {
          acc[headers[i]] = parseInt(value, 10);
        } else if (headers[i] === 'PERIOD') {
          acc[headers[i]] = stringToDate(value);
        } else {
          acc[headers[i]] = value;
        }
        return acc;
      }, {});
  });
}

export const toCSV = arr => {
  if(!(arr && arr.length)) return '';
  const headers = Object.keys(arr[0]).join(';');
  const lines = arr.map(obj => Object.values(obj).join(';'));
  return [headers, ...lines].join(';\n');
}

export const parseUserInput = str => {
  const parts = str.trim().split(' ');
 
  const getSafe = (arr, index) => arr[index] || '*';

  const rawStartAcc = getSafe(parts, 0);
  const rawEndAcc   = getSafe(parts, 1);
  const rawStartPer = getSafe(parts, 2);
  const rawEndPer   = getSafe(parts, 3);
  const rawFormat   = getSafe(parts, 4);  

  const startAccount = rawStartAcc === '*' || isNaN(parseInt(rawStartAcc, 10))
    ? '*'
    : parseInt(rawStartAcc, 10);
  
  const endAccount = rawEndAcc === '*' || isNaN(parseInt(rawEndAcc, 10))
    ? '*'
    : parseInt(rawEndAcc, 10);

  const startPeriod = rawStartPer === '*'
    ? '*'
    : stringToDate(rawStartPer);

  const endPeriod = rawEndPer === '*'
    ? '*'
    : stringToDate(rawEndPer);

  if (startPeriod === null) console.warn(`Invalid start period: ${rawStartPer}`);
  if (endPeriod === null) console.warn(`Invalid end period: ${rawEndPer}`);

  let format = 'HTML';
  if(rawFormat){
    const upper = rawFormat.toUpperCase();
    if(upper === 'CSV' || upper === 'HTML'){
      format = upper;
    }
  }
  return{
    startAccount,
    endAccount,
    startPeriod,
    endPeriod,
    format
  }
}

//Dynamic values
export const getMinMaxAccounts = accounts => {
  const ids = accounts.map(acc => acc.id);
  return {
    min: Math.min(...ids),
    max: Math.max(...ids),
  };
};

export const getMinMaxPeriods = journalEntries => {
  const periods = journalEntries.map(entry =>
    typeof entry.period === 'string' ? stringToDate(entry.period) : entry.period 
  );

  return {
    min: new Date(Math.min(...periods.map(date => date.getTime()))),
    max: new Date(Math.max(...periods.map(date => date.getTime()))),
  };
};
