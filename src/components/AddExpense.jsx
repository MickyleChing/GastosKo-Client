import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';


const AddExpense = ({ date, subcategories, onExpenseAdded, category  }) => {
  const baseURL = "https://gastos-ko-server.vercel.app/api/users";
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subCategoryName: '', // Add subcategory field
    quantity: '',
    amount: '',
    description: '',
  });

  const subcategoriesByCategory = {};

  subcategories.forEach((subcategory) => {
    if (!subcategoriesByCategory[subcategory.categoryName]) {
      subcategoriesByCategory[subcategory.categoryName] = [];
    }
    subcategoriesByCategory[subcategory.categoryName].push(subcategory);
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
    const dateOnly = date.split('T')[0];
    axios
        .post(`${baseURL}/expenses/${dateOnly}/add`, formData, {
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
            onExpenseAdded(dateOnly);
        })
        .catch((error) => {
            console.error(error.response);
            alert(`${error.response.data.message}`);
        });
        };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{width: "100%"}}>
        Add Expense
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className='modal-header-edit-form'>
          <Modal.Title>Add Expense</Modal.Title>
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

            <label>Subcategory</label>
            <Select
              className="select-search"
              name="subCategoryName"
              placeholder="Select a subcategory"
              value={
                formData.subCategoryName
                  ? { value: formData.subCategoryName, label: formData.subCategoryName }
                  : null
              }
              onChange={(selectedOption) => {
                handleInputChange({
                  target: {
                    name: 'subCategoryName',
                    value: selectedOption ? selectedOption.value : '',
                  },
                });
              }}
              options={Object.keys(subcategoriesByCategory).reduce(
                (options, categoryName) => [
                  ...options,
              
                  {
                    label: categoryName,
                    options: subcategoriesByCategory[categoryName].map((subcategory) => ({
                      value: subcategory.subCategoryName,
                      label: subcategory.subCategoryName,
                    })),
                  },
                ],
                []
              )}
            />

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
                min="1"
                max="99"
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

export default AddExpense;
