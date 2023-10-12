import React, { useState } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';

const baseURL = "https://gastos-ko-server.vercel.app/api/users";

const BudgetCategoryCard = ({ setBudgetPerCategory = [], selectedDate  }) => {

  setBudgetPerCategory = setBudgetPerCategory || [];

  const [categoryData, setCategoryData] = useState(
    setBudgetPerCategory.map((category) => ({
      ...category,
      isEditing: false,
    }))
  );

  const toggleEditMode = (index) => {
    const updatedCategoryData = [...categoryData];
    updatedCategoryData[index].isEditing = !updatedCategoryData[index].isEditing;
    setCategoryData(updatedCategoryData);
  };

  const handleBudgetAmountChange = (index, newAmount) => {
    const updatedCategoryData = [...categoryData];
    updatedCategoryData[index].budgetAmount = newAmount;
    setCategoryData(updatedCategoryData);
  };
  const formattedDate = selectedDate.toISOString().split('T')[0].slice(0, 7);
  const updateBudget = async (categoryName, budgetAmount) => {
    try {
      // Define your API endpoint URL
      const apiUrl = `${baseURL}/budget-category/${formattedDate}`;

      // Define the request payload
      const data = {
        categoryName,
        budgetAmount,
      };

      // Make the Axios PUT request
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle a successful response (you may update categoryData here if needed)
      console.log('Budget updated successfully:', response.data);

      // Toggle edit mode back to false
      const updatedCategoryData = [...categoryData];
      const indexToUpdate = updatedCategoryData.findIndex(
        (category) => category.categoryName === categoryName
      );
      updatedCategoryData[indexToUpdate].isEditing = false;
      setCategoryData(updatedCategoryData);
    } catch (error) {
      // Handle errors here (e.g., show an error message to the user)
      console.error('Error updating budget:', error);
    }
  };

  return (
    <>
      <Row xs={1} md={2} className="g-5 cards">
        {categoryData.map((category, index) => (
          <Col key={index}>
            <Card className={`category${index + 1}`}>
            <Card.Title className="category-name">{category.categoryName}</Card.Title>
              <Card.Body className="card-items"> 
                {category.isEditing ? (
                  <>
                    <input
                      type="number"
                      className='budget-amount'
                      value={category.budgetAmount}
                      style={{color: "#FFFF"}}                 
                       onChange={(e) =>
                        handleBudgetAmountChange(index, e.target.value)
                      }
                    />
                    <Button
                      className="edit-button" 
                      onClick={() =>
                        updateBudget(
                          category.categoryName,
                          category.budgetAmount
                        )
                      }
                    >
                      Save
                    </Button>
                    <Button
                      className="edit-button"  
                      onClick={() => toggleEditMode(index)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Card.Text className='budget-amount'>{category.budgetAmount}</Card.Text>
                    <Button 
                      className="edit-button"
                      onClick={() => toggleEditMode(index)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BudgetCategoryCard;
