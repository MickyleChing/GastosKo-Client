import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {Table} from "react-bootstrap";
import ExpenseTableRow from '../components/ExpenseTableRow';
import AddExpense from '../components/AddExpense';
import Balance from '../components/Balance';

const baseURL = "https://gastos-ko-server.vercel.app/api/users"
const All = () => {
  const [responseData, setResponseData] = useState([]);
  const [isEditing, setIsEditing] = useState({});// State to track editing mode
  const [editedData, setEditedData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentBalance, setBalance] = useState(null);

  const fetchBalance = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formattedDate = currentDate.toISOString().split('T')[0].slice(0, 7); // Format date to YYYY-MM
      const response = await axios.get(`${baseURL}/budget/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBalance(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/category/categories`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSubcategories(response.data);
      } catch (error) {
        console.error(error.response.data);
        setErrorMessages(`${error.response.data.message}`);
      }
    };
    fetchSubcategories();
  }, []);


  const fetchAllExpenses = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${baseURL}/user-expenses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const initialData = response.data;

      // Initialize originalData with the initial data
      const originalDataMap = {};
      initialData.forEach((dataItem) => {
        dataItem.expenses.forEach((expense) => {
          originalDataMap[expense._id] = { ...expense };
        });
      });
      setOriginalData(originalDataMap);

      setResponseData(initialData);
    } catch (error) {
      console.error(error.response.data);
      setErrorMessages(`${error.response.data.message}`);
    }
  };

  useEffect(() => {
    // Call fetchAllExpenses here to initialize data
    fetchAllExpenses();
  }, []);


 // Function to toggle editing mode
 const handleEditClick = (expenseId) => {
  setIsEditing((prevEditingState) => ({
    ...prevEditingState,
    [expenseId]: true,
  }));

  // Initialize editedData with the original data when editing starts
  setEditedData((prevData) => ({
    ...prevData,
    [expenseId]: { ...originalData[expenseId] },
  }));
};

const updateTableData = () => {

  fetchAllExpenses(); 
};


// Function to handle changes in input fields
const handleInputChange = (e, expenseId) => {
  const { name, value } = e.target;
  setEditedData((prevData) => ({
    ...prevData,
    [expenseId]: {
      ...prevData[expenseId],
      [name]: value,
    },
  }));
};

// Function to save changes
const handleSaveClick = async (expenseId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const editedExpense = editedData[expenseId];
    const originalExpense = originalData[expenseId];

    // Combine the edited data with the original data
    const combinedData = {
      ...originalExpense,
      ...editedExpense,
    };

    const response = await axios.put(`${baseURL}/expense/${expenseId}`, combinedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Edited Expense Saved:', response.data);

    setIsEditing((prevEditingState) => ({
      ...prevEditingState,
      [expenseId]: false,
    }));
    
    // After successfully saving, fetch expenses again to update the data
    fetchBalance();
    fetchAllExpenses(); // Call fetchAllExpenses to update data
  } catch (error) {
    console.error('Error saving edited expense:', error);
  }
};
const handleExpenseAdded = () => {
  // Fetch updated budget data after adding an expense
  fetchBalance(); // This should trigger a fetch of the updated budget
  fetchAllExpenses(); // This should fetch updated expense data
};
const handleExpenseDeleted = () => {
  fetchBalance(); 
  fetchAllExpenses(); 
};


  return (
    <div style={{ margin: '20px' }}>
    <h1>All Expenses</h1>
    { /*  {errorMessages && (
                <>
                <div className="error-message">{errorMessages}</div>
                <div>
                  <h3>Create Expenses here: <a href="/today">Create New</a></h3>
                </div>
                </>
    )}*/}
    <div className="budget">
    <Balance
          currentDate={currentDate}
          currentBalance={currentBalance}
          fetchBalance={fetchBalance}
        />
    </div>
    <div className="table-responsive">
    {responseData.map((expense) => (
  <div key={expense.date}>
    <h4>Date: {new Date(expense.date).toLocaleDateString()}</h4>
    <Table className="table-no-stripes" bordered hover style={{  borderCollapse: 'collapse', borderSpacing: '0px 4px'}}>
      <thead>
        <tr>
          <th className="center-header">Title</th>
          <th className="center-header">Category</th>
          <th className="center-header">Subcategory</th>
          <th className="center-header">Quantity</th>
          <th className="center-header">Amount</th>
          <th className="center-header">Total</th>
          <th className="center-header">Description</th>
          <th className="center-header"></th>
        </tr>
      </thead>
      <tbody >
        <AddExpense date={expense.date} subcategories={subcategories} onExpenseAdded={handleExpenseAdded} className="add-expense-button"/>
        <ExpenseTableRow
          key={expense._id}
          expense={expense}
          isEditing={isEditing}
          editedData={editedData}
          selectedSubcategory={selectedSubcategory}
          handleInputChange={handleInputChange}
          handleSaveClick={handleSaveClick}
          handleEditClick={handleEditClick}
          subcategories={subcategories}
          setSelectedSubcategory={setSelectedSubcategory}
          updateTableData={updateTableData}
          onExpenseDeleted={handleExpenseDeleted} 
        />
      </tbody>
      <tfoot>
        <tr style={{ textAlign: 'center' }}>
          <td colSpan="8">Total: {expense.totalAmountInArray}</td>
       </tr>
      </tfoot>
    </Table>
  </div>
))}
    </div>
  </div>
  )
}

export default All
