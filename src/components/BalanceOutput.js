import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as utils from '../utils';

class BalanceOutput extends Component {
  render() {
    if (!this.props.userInput.format) return null;

    return (
      <div className='output'>
        <p>
          Total Debit: {this.props.totalDebit} Total Credit: {this.props.totalCredit}
          <br />
          Balance from account {this.props.userInput.startAccount || '*'}
          {' '}to {this.props.userInput.endAccount || '*'}
          {' '}from period {this.props.userInput.startPeriod instanceof Date
                      ? utils.dateToString(this.props.userInput.startPeriod)
                      : '*'}
          {' '}to {this.props.userInput.endPeriod instanceof Date
                    ? utils.dateToString(this.props.userInput.endPeriod)
                    : '*'}
        </p>

        {this.props.userInput.format === 'CSV' ? (
          <div>
            <pre>{utils.toCSV(this.props.balance)}</pre>
            <a
              href={URL.createObjectURL(new Blob([utils.toCSV(this.props.balance)], { type: 'text/csv'}))}
              download="balance.csv"
              className="btn btn-sm btn-primary"
            >
              Download CSV
            </a>
          </div>
        ) : null}

        {this.props.userInput.format === 'HTML' ? (
          <table className="table">
            <thead>
              <tr>
                <th>ACCOUNT</th>
                <th>DESCRIPTION</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {this.props.balance.map((entry, i) => (
                <tr key={i}>
                  <th scope="row">{entry.ACCOUNT}</th>
                  <td>{entry.DESCRIPTION}</td>
                  <td>{entry.DEBIT}</td>
                  <td>{entry.CREDIT}</td>
                  <td>{entry.BALANCE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

BalanceOutput.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired
    })
  ).isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
  userInput: PropTypes.shape({
    startAccount: PropTypes.string,
    endAccount: PropTypes.string,
    startPeriod: PropTypes.instanceOf(Date),
    endPeriod: PropTypes.instanceOf(Date),
    format: PropTypes.string
  }).isRequired
};

export default connect(state => {
  let balance = [];
 
  const { accounts, journalEntries, userInput } = state;

  if (!accounts || !journalEntries || !userInput) {
    return {
      balance: [],
      totalCredit: 0,
      totalDebit: 0,
      userInput
    };
  }



  const sortedAccounts = [...accounts].sort((a, b) => a.ACCOUNT - b.ACCOUNT);
  const sortedPeriods = [...new Set(journalEntries.map(e => e.PERIOD))].sort((a, b) => new Date(a) - new Date(b));

   const startAccountNum = userInput.startAccount === '*'
    ? sortedAccounts[0].ACCOUNT
    : parseInt(userInput.startAccount, 10);

  const endAccountNum = userInput.endAccount === '*'
    ? sortedAccounts[sortedAccounts.length - 1].ACCOUNT
    : parseInt(userInput.endAccount, 10);

  const startAccount = String(startAccountNum);
  const endAccount = String(endAccountNum);

  const startPeriod = userInput.startPeriod instanceof Date
    ? userInput.startPeriod
    : new Date(sortedPeriods[0]);

  const endPeriod = userInput.endPeriod instanceof Date
    ? userInput.endPeriod
    : new Date(sortedPeriods[sortedPeriods.length - 1]);

  const validAccounts = sortedAccounts.filter(acc => acc.ACCOUNT >= startAccountNum && acc.ACCOUNT <= endAccountNum);
  const accountMap = Object.fromEntries(validAccounts.map(a => [a.ACCOUNT, a.LABEL]));

  const filteredEntries = journalEntries.filter(entry => {
    const acc = entry.ACCOUNT;
    const date = new Date(entry.PERIOD);
    return acc >= startAccountNum && acc <= endAccountNum && date >= startPeriod && date <= endPeriod;
  });

  const balanceMap = {};
  filteredEntries.forEach(entry => {
    const acc = entry.ACCOUNT;
    if (!balanceMap[acc]) {
      balanceMap[acc] = {
        ACCOUNT: acc,
        DESCRIPTION: accountMap[acc] || '',
        DEBIT: 0,
        CREDIT: 0,
        BALANCE: 0
      };
    }
    balanceMap[acc].DEBIT += entry.DEBIT;
    balanceMap[acc].CREDIT += entry.CREDIT;
    balanceMap[acc].BALANCE = balanceMap[acc].DEBIT - balanceMap[acc].CREDIT;
  });

  balance = Object.values(balanceMap).sort((a, b) => a.ACCOUNT - b.ACCOUNT);

  const totalCredit = balance.reduce((acc, entry) => acc + entry.CREDIT, 0);
  const totalDebit = balance.reduce((acc, entry) => acc + entry.DEBIT, 0);

  return {
    balance,
    totalCredit,
    totalDebit,
    userInput: {
      ...userInput,
      startAccount,
      endAccount
    }
  };
})(BalanceOutput);