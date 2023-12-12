import React, { useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

const DonutChartByCategories = ({ userExpenses, currentBalance, selectedMonth, budget }) => {
  const chartRefs = useRef([]); // Ref to store canvas elements

  // Function to get background color based on index
  const getBackgroundColor = (index) => {
    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(108, 117, 125)'];
    return colors[index % colors.length];
  };

  
  // Function to generate datasets and labels from userExpenses and budget
  const generateChartData = () => {
    const combinedData = {};
  
    // Accumulate total amount for each category
    userExpenses.forEach((expense) => {
      expense.expenses.forEach((expenseItem) => {
        const key = expenseItem.categoryName;
  
        combinedData[key] = combinedData[key] || {
          id: key,
          nested: [],
        };
  
        combinedData[key].nested.push({
          title: expenseItem.title,
          value: expenseItem.totalAmountInArray,
        });
      });
    });
  
    // Include budgetAmount for each category in the combined data
    budget?.forEach((budgetItem) => {
      const key = budgetItem.categoryName;
  
      combinedData[key] = combinedData[key] || {
        id: key,
        nested: [],
      };
  
      // Check if nested is defined
      const nestedItem = combinedData[key]?.nested.find((item) => item.title === 'Budget');
  
      if (nestedItem) {
        // If "Budget" entry exists, update its value
        nestedItem.value += budgetItem.budgetAmount;
      } else {
        // If "Budget" entry doesn't exist, create a new one
        combinedData[key].nested.push({
          title: 'Budget',
          value: budgetItem.budgetAmount,
        });
      }
    });
  
    // Include Current Balance in the combined data
    if (currentBalance && selectedMonth) {
      const currentBalanceKey = 'Current Balance';
      combinedData[currentBalanceKey] = {
        id: currentBalanceKey,
        nested: [{ title: 'Current Balance', value: currentBalance }],
      };
    }
  
    const datasets = Object.keys(combinedData).map((key, index) => {
      const nestedData = combinedData[key]?.nested || [];
  
      const data = nestedData.map((item) => item.value);
      const backgroundColor = Array.from({ length: nestedData.length }, (_, i) => getBackgroundColor(i));
  
      return {
        data,
        backgroundColor,
        label: key,
      };
    });
  
    const labels = combinedData[Object.keys(combinedData)[0]]?.nested?.map((item) => item.title) || [];
  
    return { datasets, labels, combinedData };
  };

  useEffect(() => {
    // Ensure chartRefs is properly initialized
    chartRefs.current = chartRefs.current.slice(0, Object.keys(combinedData).length);

    // Iterate through chartRefs and initialize or update charts
    chartRefs.current.forEach((chartRef, index) => {
      if (chartRef) {
        const ctx = chartRef.getContext('2d');

        // Destroy existing chart instance
        if (window.myCharts && window.myCharts[index]) {
          window.myCharts[index].destroy();
        }

        const categoryName = Object.keys(combinedData)[index];
        const categoryData = combinedData[categoryName];

        const datasets = [
          {
            data: categoryData.nested.map((item) => item.value),
            backgroundColor: Array.from({ length: categoryData.nested.length }, (_, i) =>
              getBackgroundColor(i)
            ),
          },
        ];

        const labels = categoryData.nested.map((item) => item.title);

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
        window.myCharts = window.myCharts || [];
        window.myCharts[index] = new Chart(ctx, cfg);
      }
    });
  }, [userExpenses, currentBalance, selectedMonth, budget]);

  // Destructure combinedData from the result of generateChartData
  const { combinedData } = generateChartData();

  return (
    <>
      <h1>Categories:</h1>
      <div className="donut-chart">
        {Object.keys(combinedData).map((categoryName, index) => (
          <div key={index} style={{ width: '300px', height: '300px', margin: '25px' }}>
            <p>{categoryName}</p> {/* Include categoryName here */}
            <canvas ref={(ref) => (chartRefs.current[index] = ref)}></canvas>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonutChartByCategories;
