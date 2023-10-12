import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';


const DeleteExpense = ({ expenseId, onExpenseDeleted }) => {
  const baseURL = "https://gastos-ko-server.vercel.app/api/users";
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);

    const accessToken = localStorage.getItem('accessToken');
    axios
      .get(`${baseURL}/expense/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setExpense(response.data); // Set the expense data when it's fetched
        } else {
          console.error('Unexpected server response:', response);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const handleDelete = () => {
    const accessToken = localStorage.getItem('accessToken');

    axios
    .delete(`${baseURL}/expense/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        onExpenseDeleted();
        handleClose();
      } else {
        console.error('Unexpected server response:', response);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  };
  
  useEffect(() => {
    if (show) {
      handleShow();
    }
  }, [show]);


  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Button onClick={handleShow} variant='danger' style={{ width: '100%' }}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className='modal-header-edit-form'>
          <Modal.Title>Delete Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h3>Are you sure you want to delete this expense?</h3>
            {expense && (
              <>
                <p>Title: {expense.title}</p>
                <p>Category: {expense.categoryName}</p>
                <p>Subcategory: {expense.subCategoryName}</p>
                <p>Quantity: {expense.quantity}</p>
                <p>Amount: {expense.amount}</p>
                <p>Description: {expense.description}</p>
               
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteExpense;
