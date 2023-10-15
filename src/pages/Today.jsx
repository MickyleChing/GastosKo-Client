import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button} from 'react-bootstrap';
import ExpenseTableRow from '../components/ExpenseTableRow';
import AddExpense from '../components/AddExpense';
import CreateExpense from '../components/CreateExpense';
import { FaCalendarDays } from "react-icons/fa6";
import CalendarModal from '../components/CalendarModal';
import Balance from '../components/Balance';

const baseURL = "https://gastos-ko-server.vercel.app/api/users";

const Today = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [editedData, setEditedData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState({});
  const [currentBalance, setCurrentBalance] = useState(null);
  
  const fetchBalance = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formattedDate = currentDate.toISOString().split('T')[0].slice(0, 7); // Format date to YYYY-MM
      const response = await axios.get(`${baseURL}/budget/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentBalance(response.data);
      console.log( "Budget:", response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        // Handle the 404 error here, for example, set currentBalance to null
        setCurrentBalance(null);
      } else {
        console.error('An error occurred while fetching the balance:', error);
      }
    }
  };

useEffect(() =>{
  fetchBalance(); 
},[currentDate])

  const handleCalendarChange = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const selectedDate = new Date(Date.UTC(year, month, day));
  
    setCurrentDate(selectedDate);
    setModalVisible(false);
    fetchExpensesForDate(selectedDate.toISOString().split('T')[0]);
  };

  const fetchExpensesForDate = async (date) => {
    try {
      if (!date) {
        console.error('Date is undefined.');
        return;
      }
  
      const accessToken = localStorage.getItem('accessToken');
      console.log('Fetching expenses for date:', date);
      const response = await axios.get(`${baseURL}/expenses/${date}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const initialData = response.data;
  
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
  
      if (error.response.status === 404) {
        // No expenses found, clear responseData
        setResponseData([]);
      } else {
        setErrorMessages(`${error.response.data.message}`);
      }
    }
  };
  

  useEffect(() => {
    const formattedDate = currentDate.toISOString().split('T')[0];
    fetchExpensesForDate(formattedDate);
  }, [currentDate]);

  
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
//save the edited data
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

    // Update the currentDate to the date of the expense you just edited
    setCurrentDate(new Date(response.data.date));
   
    // After successfully saving, fetch expenses again to update the data
    fetchExpensesForDate(response.data.date);
    fetchBalance();
  } catch (error) {
    console.error('Error saving edited expense:', error);
  }
};
const handleExpenseAdded = (dateOnly) => {
  // Fetch updated budget data after adding an expense
  fetchBalance(); // This should trigger a fetch of the updated budget
  fetchExpensesForDate(dateOnly); // This should fetch updated expense data
};
const handleExpenseDeleted = () => {
  fetchExpensesForDate(currentDate.toISOString().split('T')[0]); 
  fetchBalance();
};

const handleExpenseCreated = async (date) => {
  try {
    console.log('Handling expense creation for date:', date);

    // Fetch updated expense data
    await fetchExpensesForDate(date);
    console.log('Expense data fetched successfully for date:', date);

    // Fetch and update the budget
    await fetchBalance();
    console.log('Budget updated successfully.');

  } catch (error) {
    console.error('Error handling expense created:', error);
  }
};

const isToday = () => {
  const today = new Date();
  return (
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

const handlePreviousDayClick = () => {
  const newDate = new Date(currentDate.getTime() - 86400000); // Subtract one day
  setCurrentDate(newDate);
  fetchBalance(); // Fetch the balance for the new date
};

const handleNextDayClick = () => {
  const newDate = new Date(currentDate.getTime() + 86400000); // Add one day
  setCurrentDate(newDate);
  fetchBalance(); // Fetch the balance for the new date
};

const handleCalendarIconClick = () => {
  setModalVisible(!modalVisible);
};

  
  return (
    <div style={{ margin: '20px' }}>
      <h1>Expenses for</h1>
      <div className="date-pagination">
      <button 
        style={{
          backgroundColor: 'transparent', 
          border: 'none', 
          fontSize: '25px', 
          fontFamily: 'VCRODOMono', 
          fontWeight: 'bold'
        }} 
        onClick={handlePreviousDayClick}>
        &lt; {/* This represents '<' */}
      </button>
      <button 
        style={{
          backgroundColor: 'transparent', 
          border: 'none', 
          fontSize: '25px', 
          fontFamily: 'VCRODOMono'
        }} 
        onClick={() => setCurrentDate(new Date())}>
       {isToday() ? 'Today' : currentDate.toDateString()} {/* Display current date */}
      </button>
      <button 
        style={{
          backgroundColor: 'transparent', 
          border: 'none', 
          fontSize: '25px', 
          fontFamily: 'VCRODOMono', 
          fontWeight: 'bold'
        }} 
        onClick={handleNextDayClick}>
        &gt; {/* This represents '>' */}
      </button>
      <button
        style={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
        onClick={handleCalendarIconClick}
      >
        <FaCalendarDays />
      </button>
      <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Pass the onClose function
        currentDate={currentDate}
        onDateChange={handleCalendarChange}
      />
      </div>
      
      {errorMessages.length > 0 && (
  <div className="error-message">{errorMessages[0]}</div>
)}

<div className="budget">
  <Balance
    currentDate={currentDate}
    currentBalance={currentBalance}
    fetchBalance={fetchBalance}
  />
</div>

{currentBalance === null ? (
  <div>
    <p>Please add a budget first to create expenses.</p>
    <Button onClick={() => window.location.href = "/budget"}>
      Add Budget
    </Button>
  </div>
) : subcategories.length === 0 ? (
  <div>
    <p>No subcategories found. Please add subcategories first.</p>
    <Button onClick={() => window.location.href = "/settings"}>
      Add Subcategories
    </Button>
  </div>
) : (
  <>
    {/* Render other content when currentBalance is not null */}
    {responseData.length === 0 && (
      <CreateExpense
        date={currentDate.toISOString().split('T')[0]}
        subcategories={subcategories}
        userId={userId}
        handleExpenseCreated={(date) => {
          handleExpenseCreated(date);
        }}
      />
    )}
  </>
)}

      <div className="table-responsive">
    {responseData.map((expense) => (
  <div key={expense.date}>
    <h4>Date: {new Date(expense.date).toLocaleDateString()}</h4>
    <Table 
    className="table-no-stripes" 
    bordered hover 
    style={{
       borderCollapse: 'collapse'
       }}
    >
      <thead>
        <tr>
          <th className="center-header">Title</th>
          <th className="center-header">Category</th>
          <th className="center-header">Subcategory</th>
          <th className="center-header">Quantity</th>
          <th className="center-header">Amount</th>
          <th className="center-header">Total</th>
          <th className="center-header">Description</th>
          <th className="center-header">Action</th>
        </tr>
      </thead>
      <tbody>
      <AddExpense 
          date={expense.date} 
          subcategories={subcategories} 
          onExpenseAdded={handleExpenseAdded} />
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
          onExpenseDeleted={handleExpenseDeleted} 
        />
      </tbody>
      <tfoot>
        <tr 
        style={{ 
          textAlign: 'center' 
          }}
        >
          <td colSpan="8">Total: {expense.totalAmountInArray}</td>
       </tr>
      </tfoot>
    </Table>
  </div>
))}
    </div>
    </div>
  );
};

export default Today;