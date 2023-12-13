import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import DonutChart from '../components/charts/DonutChart';
import axios from 'axios';
import YearMonthDropdown  from '../components/YearDropdown';
import DonutChartByCategories from '../components/charts/DonutChartByCategories';
import BarChart from '../components/charts/BarChart';

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
  const [displaySubcategories, setDisplaySubcategories] = useState(true);

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

  const handleSwitch = () => {
    setDisplaySubcategories((prev) => !prev);
  };

  return (
    <div style={{ margin: '20px' }}>
      <div className="year-month-btn">
      <YearMonthDropdown
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearMonthChange={handleYearMonthChange}
      />
      </div>
      {responseData.userExpenses.length === 0 && (
        <p style={{ marginTop: "10px" }}>No expenses found for the selected period.</p>
      )}
      <h4 style={{ marginTop: "10px" }}>Total amount for {selectedYear} {selectedMonth}: {responseData.totalAmount}</h4>
      <DonutChartByCategories
        userExpenses={responseData.userExpenses}
        currentBalance={budget.currentBalance}
        selectedMonth={selectedMonth}
        budget={budget.budgetPerCategory}
      />
      <div className="switch-btn">
        <Button onClick={handleSwitch}>
          {displaySubcategories ? 'Switch to Category' : 'Switch to Subcategory'}
        </Button>
      </div>
      <div className="category-chart">
      <DonutChart
        userExpenses={responseData.userExpenses}
        currentBalance={budget.currentBalance}
        selectedMonth={selectedMonth}
        displaySubcategories={displaySubcategories}
        chartType="doughnut"
      />
      <BarChart
        userExpenses={responseData.userExpenses}
        currentBalance={budget.currentBalance}
        selectedMonth={selectedMonth}
        displaySubcategories={displaySubcategories}
        chartType="bar"
      />
      </div>
    </div>
  );
};

export default Dashboard;
