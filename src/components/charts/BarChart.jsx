import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const getLabel = (displaySubcategories) => {
    return displaySubcategories ? 'Subcategory' : 'Category';
  };
  
const BarChart = ({ userExpenses, currentBalance, selectedMonth, displaySubcategories }) => {
  const chartRef = useRef(null);
  const myChart = useRef(null);

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

    // Include Current Balance in the combined data
    if (currentBalance && selectedMonth) {
      const currentBalanceKey = 'Current Balance';
      combinedData[currentBalanceKey] = {
        id: currentBalanceKey,
        nested: { value: currentBalance },
      };
    }

    // Sort the data by categoryName and then by subCategoryName
    const sortedData = Object.entries(combinedData)
      .sort(([aKey], [bKey]) => {
        const [aCategory, aSubCategory] = aKey.split('_');
        const [bCategory, bSubCategory] = bKey.split('_');

        // First, sort by categoryName
        const categoryComparison = aCategory.localeCompare(bCategory);

        // If category names are the same, sort by subCategoryName
        if (categoryComparison === 0) {
          return aSubCategory.localeCompare(bSubCategory);
        }

        return categoryComparison;
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const datasets = [
      {
        data: Object.values(sortedData).map((data) => data.nested.value),
        backgroundColor: Object.keys(sortedData).map((key) => {
            const [categoryName, subCategoryName] = key.split('_');
            return getBackgroundColor(categoryName, subCategoryName);
          }),
        label: getLabel(displaySubcategories),
      },
    ];

    const labels = Object.keys(sortedData).map((key) => {
      const [categoryName, subCategoryName] = key.split('_');
      return displaySubcategories ? subCategoryName || categoryName : categoryName;
    });

    return { datasets, labels };
  };

  // Function to get background color based on index
  const getBackgroundColor = (categoryName, subCategoryName) => {
    const colorMap = {
      Bills: '#003366',
      Food: '#66cc99',
      'E-Commerce': '#660099',
      Entertainment: '#ff3300',
      Shop: '#ff9900',
    };
    const colorKey = subCategoryName = categoryName;
  
    return colorMap[colorKey] || '#BFBFBF';
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (!myChart.current) {
      // Create a new chart instance if it doesn't exist
      const { datasets, labels } = generateChartData();

      const cfg = {
        type: 'bar',
        data: {
          labels,
          datasets,
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };

      myChart.current = new Chart(ctx, cfg);
    } else {
      // Update chart data if the instance already exists
      const { datasets, labels } = generateChartData();
      myChart.current.data.labels = labels;
      myChart.current.data.datasets = datasets;
      myChart.current.update();
    }
  }, [userExpenses, currentBalance, displaySubcategories]);

  return (
    <>
        <div className="bar-category">
          <canvas ref={chartRef}></canvas>
        </div>
    </>
  );
};

export default BarChart;
