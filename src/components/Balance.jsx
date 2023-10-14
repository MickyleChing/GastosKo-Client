import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Balance = ({ currentDate, setBudgetPerCategory, fetchBalance  }) => {
  const [currentBalance, setBalance] = useState(null);
  const baseURL = "https://gastos-ko-server.vercel.app/api/users";

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const formattedDate = currentDate.toISOString().split('T')[0].slice(0, 7);
        const response = await axios.get(`${baseURL}/budget/${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBalance(response.data.currentBalance);
        console.log("Current Balance: ", response.data.currentBalance);
        
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          // Handle the 404 error here, for example, set currentBalance to null
          setBalance(null);
        } else {
          console.error('An error occurred while fetching the balance:', error);
        }
      }
    };

    fetchBalance();
  }, [currentDate, fetchBalance]);

  return (
    <div className="balance">
      <div className="current-balance-container">
        <p className="balance-title">Current Balance</p>
        {currentBalance !== null ? (
          <p className="balance-amount">{currentBalance}</p>
        ) : (
          <p className="balance-amount">No budget found</p>
        )}
      </div>
    </div>
  );
};

export default Balance;
