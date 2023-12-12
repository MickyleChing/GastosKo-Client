import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';

const Account = () => {
  const baseURL = "https://gastos-ko-server.vercel.app/api/users";
  const [responseData, setResponseData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/currentUser`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setResponseData(response.data);
      console.log("User: ", response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        // Handle 404 error
      } else {
        console.error('An error occurred while fetching the User Info:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch the balance when the component mounts
    fetchCurrentUser();
  }, []);

  const { firstName, lastName, email, username } = responseData;

  return (
    <div style={{ margin: '20px' }}>
       <h1>Account</h1>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={`${firstName} ${lastName}`} readOnly />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={email} readOnly />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} readOnly />
        </Form.Group>
      </Form>
    </div>
  );
};

export default Account;
