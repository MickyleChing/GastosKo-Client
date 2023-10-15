import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Balance from '../components/Balance';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import { Modal, Button } from 'react-bootstrap';

const baseURL = "https://gastos-ko-server.vercel.app/api/users";

const Budget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budgetPerCategory, setBudgetPerCategory] = useState(null);
  const [budget, setBudget] = useState(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState('');
  const [currentBalance, setBalance] = useState(null);
  
//Fetch Budget
  const fetchBudget = async() => {
    try{
      const accessToken = localStorage.getItem("accessToken");
      const formattedDate = currentDate.toISOString().split('T')[0].slice(0, 7);
      
      const response = await axios.get(`${baseURL}/budget/${formattedDate}`, {
        headers:{
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(`Budget:`, response.data)
      setBudget(response.data)
    }catch(error){
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchBudget();
  }, []);


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
      setBudgetPerCategory(response.data.budgetPerCategory);
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

  useEffect(() => {
    // Fetch the balance when the component mounts
    fetchBalance();
  }, [currentDate]);

//Create Budget
const createBudget = () => {
  setCreateModalVisible(true); // Show the modal
};

const closeBudgetModal = () => {
  setCreateModalVisible(false);
  setNewBudgetValue(''); // Clear the input
};

const refreshBalance = () => {
  // Call this function to refresh the balance
  fetchBalance();
};

// Save the budget with the entered value
const saveBudget = () => {
  const formattedDate = currentDate.toISOString().split('T')[0].slice(0, 7);
  const reqData = {
    budget: newBudgetValue,
    date: formattedDate,
  };
  axios.post(`${baseURL}/new-budget`, reqData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
  })
   .then((response) => {
    console.log(response.data);
    setCreateModalVisible(false); // Hide the modal
    setNewBudgetValue(''); // Clear the input
    fetchBudget();
    setBudgetPerCategory(response.data.budgetPerCategory);
    refreshBalance();
    })
    .catch((error) => {
      console.error(error);
    })
};


  return (
    <div style={{ margin: '20px' }}>
    <h1>Budget</h1>
    <div className="budget">
    <Balance
      currentDate={currentDate}
      setBudgetPerCategory={setBudgetPerCategory} 
      refreshBalance={refreshBalance}
    />
    </div>
    <div>
      {budget !== null ? (
        <div>
          <p>Your budget this month: {budget.budget}</p>
          {/* Render other budget-related information */}
        </div>
      ) : (
        <div>
          <p>Create a budget for this month:</p>
          <Button onClick={createBudget}>Create Budget</Button>
        </div>
      )}
    </div>
    <Modal show={isCreateModalVisible} onHide={closeBudgetModal}>
        <div className="modal-content">
          <Modal.Header closeButton>
            <Modal.Title>Enter Your Budget</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="number"
              placeholder="Enter your Budget here"
              value={newBudgetValue}
              onChange={(e) => setNewBudgetValue(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeBudgetModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveBudget}>
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

    {budgetPerCategory !== null ? (
      <BudgetCategoryCard setBudgetPerCategory={budgetPerCategory} selectedDate={currentDate} />
    ) : (
      <p></p>
    )}
  </div>
)
}

export default Budget;
