import React, { useState, useEffect } from 'react';
import DonutChart from '../components/charts/DonutChart';
import axios from 'axios';
import YearMonthDropdown  from '../components/YearDropdown';
import DonutChartByCategories from '../components/charts/DonutChartByCategories';

const baseURL = "https://gastos-ko-server.vercel.app/api/users";

const Dashboard = () => {
  const [responseData, setResponseData] = useState({
    userExpenses: [],
    totalAmount: 0,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [errorMessages, setErrorMessages] = useState([]);
  const [budget, setBudget] = useState(0);

  const fetchAllExpensesPerMonth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const year = selectedYear;
      const month = selectedMonth;
      const response = await axios.get(`${baseURL}/user-expenses${month ? `/${year}-${month}` : `/${year}`}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      console.log(`Expenses for date ${year}${month ? ` ${month}` : ''}:`, response.data);
  
      setResponseData({
        userExpenses: response.data.userExpenses || [],
        totalAmount: response.data.totalAmount || 0,
      });
  
      // Clear any error messages if the request is successful
      setErrorMessages([]);
    } catch (error) {
      console.error(error.response.data);
  
      // Ensure that errorMessages is an array
      const messages = Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message];
  
      setErrorMessages(messages);
  
      // Optionally, set the state to indicate that data fetching failed
      setResponseData({
        userExpenses: [],
        totalAmount: 0,
      });
    }
  };

  // FETCHING BUDGET
  const fetchBudget = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const year = selectedYear;
    const month = selectedMonth;
    const response = await axios.get(`${baseURL}/budget${month ? `/${year}-${month}` : `/${year}`}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    console.log(`Budget:`, response.data.budgetPerCategory);
    setBudget(response.data);

    // Clear any error messages if the request is successful
    setErrorMessages([]);
  } catch (error) {
    console.error(error);

    // Ensure that errorMessages is an array
    const messages = Array.isArray(error.response?.data.message)
      ? error.response.data.message
      : [error.response?.data.message];

    setErrorMessages(messages);

    // Optionally, set the state to indicate that data fetching failed
    setBudget(0);
  }
};

useEffect(() => {
  fetchBudget();
}, [selectedYear, selectedMonth]);

  const handleYearMonthChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  useEffect(() => {
    fetchAllExpensesPerMonth();
    fetchBudget();
  }, [currentDate, selectedYear, selectedMonth]);

  return (
    <div style={{ margin: '20px' }}>
      <h1>Dashboard Page</h1>
      <div className="year-month-btn">
      <YearMonthDropdown
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearMonthChange={handleYearMonthChange}
      />
      </div>
      <DonutChart
        userExpenses={responseData.userExpenses}
        currentBalance={budget.currentBalance}
        selectedMonth={selectedMonth}
      />
      <DonutChartByCategories
        userExpenses={responseData.userExpenses}
        currentBalance={budget.currentBalance}
        selectedMonth={selectedMonth}
        budget={budget.budgetPerCategory}
      />
      {responseData.userExpenses.length === 0 && (
        <p style={{ marginTop: "25px" }}>No expenses found for the selected period.</p>
      )}
      <h4 style={{ marginTop: "25px" }}>Total amount for {selectedYear} {selectedMonth}: {responseData.totalAmount}</h4>
    </div>
  );
};

export default Dashboard;
