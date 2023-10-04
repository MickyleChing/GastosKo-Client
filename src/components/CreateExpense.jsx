import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const CreateExpense = ({ date, subcategories, handleExpenseCreated  }) => {
  const baseURL = "http://localhost:5050/api/users";
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subCategoryName: '', // Add subcategory field
    quantity: '',
    amount: '',
    description: '',
    date: date,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    // Check if the input field being changed is 'subcategory'
    if (name === 'subCategoryName') { // Updated to match form field name
      // Find the corresponding subcategory object
      const selectedSubcategory = subcategories.find(
        (subcategory) => subcategory.subCategoryName === value
      );
  
      // Update the selectedCategory with the categoryName of the selected subcategory
      setFormData({
        ...formData,
        [name]: value,
        selectedCategory: selectedSubcategory ? selectedSubcategory.categoryName : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.quantity || !formData.amount) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const accessToken = localStorage.getItem('accessToken');
    const requestData = {
      date: date, 
      expenses: [
        {
          subCategoryName: formData.subCategoryName,
          quantity: formData.quantity,
          title: formData.title,
          amount: formData.amount,
          description: formData.description || '', // Use the description from the form or an empty string
        },
      ],
    };
  
    axios
      .post(`${baseURL}/expenses`, requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFormData({
          title: '',
          subCategoryName: '',
          quantity: '',
          amount: '',
          description: '',
        });
        handleClose();
        handleExpenseCreated(response.data.date); // Trigger the update
        console.log('handleExpenseCreated called.');
      })
      .catch((error) => {
        console.error(error.response);
        alert(`${error.response.data.message}`);
      });
  };
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long', // Use 'long' for full month name
      day: 'numeric',
    };
  
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create New Expense
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className='modal-header-edit-form'>
          <Modal.Title>New Expense for {date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="edit-form">
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="input"
                name="title"
                value={formData.title}
                placeholder="Enter Title here"
                autoFocus
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="subcategory">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control
                    as="select" // Use select for dropdown
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleInputChange}
                >
                    <option value="">Select a subcategory</option>
                    {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory.subCategoryName}>
                        {subcategory.subCategoryName}
                    </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="selectedCategory"
                value={formData.selectedCategory}
                placeholder="Selected Category"
                readOnly // Make the input read-only
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                placeholder="Enter Quantity here"
                autoFocus
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                placeholder="Enter Amount here"
                autoFocus
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="description"
              name="description"
              value={formData.description}
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateExpense;
