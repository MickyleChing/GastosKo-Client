import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DonutChartByCategories = ({ userExpenses, currentBalance, selectedMonth, budget }) => {
  const chartRefs = useRef([]); // Ref to store canvas elements

  // Function to get background color based on categoryName
  const getBackgroundColor = (categoryName, isRemainingBudget) => {
    const colorMap = {
      Bills: '#003366',
      Food: '#66cc99',
      'E-Commerce': '#660099',
      Entertainment: '#ff3300',
      Shop: '#ff9900',
    };

    // If it's Remaining Budget, use a different color
    if (isRemainingBudget) {
      return '#BFBFBF';
    }

    return colorMap[categoryName] || '#BFBFBF';
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

    // Calculate and include "Remaining" budget for each category in the combined data
    budget?.forEach((budgetItem) => {
      const key = budgetItem.categoryName;

      combinedData[key] = combinedData[key] || {
        id: key,
        nested: [],
      };

      const totalExpenseAmount = userExpenses.reduce((total, expense) => {
        return (
          total +
          expense.expenses.reduce((expenseTotal, expenseItem) => {
            if (expenseItem.categoryName === key) {
              expenseTotal += expenseItem.totalAmountInArray;
            }
            return expenseTotal;
          }, 0)
        );
      }, 0);

      const remainingBudget = budgetItem.budgetAmount - totalExpenseAmount;

      combinedData[key].nested.push({
        title: 'Remaining Budget',
        value: remainingBudget,
      });
    });

    const datasets = Object.keys(combinedData).map((key) => {
      const nestedData = combinedData[key]?.nested || [];

      const data = nestedData.map((item) => item.value);
      const backgroundColor = Array.from({ length: nestedData.length }, (_, i) =>
        getBackgroundColor(key, nestedData[i]?.title === 'Remaining Budget')
      );

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
              getBackgroundColor(categoryName, categoryData.nested[i]?.title === 'Remaining Budget')
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
      <div className="donut-chart">
        {Object.keys(combinedData).map((categoryName, index) => (
          <div key={index} style={{ width: '250px', height: '250px', margin: '25px' }}>
            <canvas ref={(ref) => (chartRefs.current[index] = ref)}></canvas>
            <p style={{ textAlign: 'center' }}>{categoryName}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonutChartByCategories;
