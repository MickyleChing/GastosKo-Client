import React from 'react';
import Form from 'react-bootstrap/Form';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa6';
import { Button } from 'react-bootstrap';
const RegistrationForm = ({ formData, handleInputChange, register }) => {
    return (
      <Form>
        <Form.Group className="mb-4" controlId="username">
          <div className="input-container">
            <FaUser className="input-icon" />
            <Form.Control
              type="username"
              name="username"
              placeholder="Enter username"
              className="register-forms"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-4" controlId="email">
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              className="register-forms"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="password">
          <div className="input-container">
            <FaLock className="input-icon" />
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              className="register-forms"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="confirmPassword">
          <div className="input-container">
            <FaLock className="input-icon" />
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="register-forms"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="register-button"
          onClick={register}
        >
          Signup
        </Button>
      </Form>
    );
  };

  export default RegistrationForm;