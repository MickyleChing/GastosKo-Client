import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Dropdown } from 'react-bootstrap';

const Settings = () => {
  const baseURL = "https://gastos-ko-server.vercel.app/api/users";
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
        setErrorMessages([error.response.data.message]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName); // Set category name directly
  };
  

  const handleCreateSubCategory = async () => {
    if (!selectedCategory || !subCategoryName) {
      setErrorMessages(['Please select a category and enter a subcategory name.']);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(`${baseURL}/category/subcategory`, {
        categoryName: selectedCategory,
        subCategoryName: subCategoryName,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Clear the input field and error messages
      setSubCategoryName('');
      setErrorMessages([]);
      console.log(`${subCategoryName} Subcategory Successfuly Created in ${selectedCategory} Category`);
      alert(`${subCategoryName} Subcategory Successfuly Created in ${selectedCategory} Category`);
    } catch (error) {
      console.error(error.response.data);
      setErrorMessages([error.response.data.message]);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Settings</h1>
      <div className="category">
        <h4>Category Settings</h4>
      <Form className="create-category">
        <Form.Group>
        <Form.Label className="category-label">Select a Category:</Form.Label>
        <Dropdown onSelect={(category) => handleCategorySelect(category)}>
        <Dropdown.Toggle variant="success" id="category-dropdown">
          {selectedCategory ? selectedCategory : 'Select a category'}
        </Dropdown.Toggle>
        <Dropdown.Menu className="category-dropdown">
          {categories.map((category, index) => (
            <Dropdown.Item
              key={category._id}
              eventKey={category.categoryName}
              className={`category-item${index + 1}`} // Change this to categoryName
            >
              {category.categoryName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        </Dropdown>
        </Form.Group>
        <Form.Group>
          <Form.Label className="category-label">Subcategory Name:</Form.Label>
          <Form.Control
            type="text"
            className="subcategory-input"
            placeholder="Enter Subcategory Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreateSubCategory}>
          Create Subcategory
        </Button>
      </Form>
      {errorMessages.length > 0 && (
        <div className="error-messages">
          {errorMessages.map((message, index) => (
            <p key={index} className="text-danger">{message}</p>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Settings;
