import React, { useEffect } from 'react';

const Balance = ({ currentDate, currentBalance, fetchBalance }) => {
  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="balance">
      <div className="current-balance-container">
        <p className="balance-title">Current Balance</p>
        {currentBalance !== null ? (
          <p className="balance-amount">{currentBalance.currentBalance}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Balance;
