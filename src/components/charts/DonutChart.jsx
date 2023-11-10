import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';

const DonutChart = ({ userExpenses, currentBalance, selectedMonth }) => {
  const chartRef = useRef(null);
  const [displaySubcategories, setDisplaySubcategories] = useState(true);


  
  // Function to generate datasets and labels from userExpenses
  const generateChartData = () => {
    const combinedData = {};

    userExpenses.forEach((expense) => {
      expense.expenses.forEach((expenseItem) => {
        const key = displaySubcategories
        ? `${expenseItem.categoryName}_${expenseItem.subCategoryName}`
        : `${expenseItem.categoryName}_${expenseItem.categoryName}`;

        if (combinedData[key]) {
          combinedData[key].nested.value += expenseItem.totalAmountInArray;
        } else {
          combinedData[key] = {
            id: key,
            nested: { value: expenseItem.totalAmountInArray },
          };
        }
      });
    });

    // Include Current Balancein the combined data
    if (currentBalance && selectedMonth) {
      const currentBalanceKey = 'Current Balance';
      combinedData[currentBalanceKey] = {
        id: currentBalanceKey,
        nested: { value: currentBalance },
      };
    }

    const datasets = [
      {
        data: Object.values(combinedData),
        backgroundColor: getBackgroundColor(),
      },
    ];

    const labels = Object.keys(combinedData).map((key) => {
      const [categoryName, subCategoryName] = key.split('_');
      return displaySubcategories ? subCategoryName || categoryName : categoryName;
    });

    return { datasets, labels };
  };

  // Function to get background color based on index
  const getBackgroundColor = (index) => {
    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(108, 117, 125)']; // Add more colors if needed
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (chartRef.current && (userExpenses.length > 0 || currentBalance)) {
      const ctx = chartRef.current.getContext('2d');
  
      // Destroy existing chart instance
      if (window.myChart) {
        window.myChart.destroy();
      }
  
      const { datasets, labels } = generateChartData();
  
      const cfg = {
        type: 'doughnut',
        data: {
          datasets,
          labels,
        },
        options: {
          parsing: {
            key: 'nested.value',
          },
        },
      };
  
      // Create a new chart instance and store it in the window object
      window.myChart = new Chart(ctx, cfg);
    }
  }, [userExpenses, currentBalance, displaySubcategories]);
  
  const handleSwitch = () => {
    setDisplaySubcategories((prev) => !prev);
  };
  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Button onClick={handleSwitch}>
      {displaySubcategories ? 'Switch to Category' : 'Switch to Subcategory'}
      </Button>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DonutChart;
