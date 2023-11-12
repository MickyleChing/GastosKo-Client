import React, { useState } from 'react';
import './LandingPage.css';
import LogoImage from '../photos/GastosKo.png';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegisterForm';
import { GoogleLogin } from '@react-oauth/google';

const baseURL = 'https://gastos-ko-server.vercel.app/api/users';

const LandingPage = () => {
  const initialFormData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Default to registration form

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function toggleForm() {
    setIsRegistering(!isRegistering);
    setErrorMessages([]);
    setSuccessMessage('');
    setFormData(initialFormData);
  }

  function register(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Invalid email address.');
      return;
    }

    axios
      .post(`${baseURL}/register`, formData)
      .then((response) => {
        console.log(response.data); 
        setSuccessMessage('Registration successful.');
        setFormData(initialFormData); 
      })
      .catch((error) => {
        console.error(error.response); 
        alert(`${error.response.data.message}`); 
      });
  }
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();
    axios
    .post(`${baseURL}/login`, formData)
    .then((response)=>{
      if (response.data.accessToken){
        const{accessToken} = response.data;
        console.log("Access Token: ", accessToken);
        localStorage.setItem("accessToken", accessToken);
        navigate('/dashboard');
      }
    }) 
    .catch((error) =>{
      console.error("Login failed", error)
      setErrorMessages(`${error.response.data.message}`);
    })
  }

  //Login using Gmail
   const responseGoogle = (response) => {
    const tokenId = response.credential;

    axios.post(`${baseURL}/googlelogin`, { tokenId })
      .then((response) => {
        if (response.data.accessToken) {
          const { accessToken } = response.data;
          console.log("Access Token: ", accessToken);
          localStorage.setItem("accessToken", accessToken);
          navigate('/dashboard');
        } else {
          console.error("Login failed: No access token received");
          setErrorMessages('Login failed: No access token received');
        }
      })
      .catch((error) => {
        console.error("Login failed", error);
        setErrorMessages(`${error.response.data.message}`);
      });
 
  };


  return (

    <div>
      <div className="landing-description">
        <div className="landing-container">
          <h1 className="title">
            Track your Expenses with <span className="app">GastosKo</span>
          </h1>
          <div className="paragraph-container">
            <p className="title-description">
              GastosKo literally translates to My Expenses. This project demonstrates how users may use data analytics
              to analyze their costs throughout the day, week, and month, allowing them to understand where their money
              is going and make plans for how they should utilize it towards the future.
            </p>
          </div>
        </div>
        <div>
          <img className="img" src={LogoImage} alt="My Logo" />
        </div>
      </div>
      <div className="register">
        <div className="login-container">
          <div className="login-description-container">
            <div className="login-description">
              <h1 className="title-register">Track Your Expenses with GastosKo</h1>
              <div className="login-content-container">
                <h4 className="isregistering">
                {isRegistering ? 'Already have an Account?' : 'Dont Have an Account'}
                </h4>
                <br />
                <h4 className="login-link" onClick={toggleForm}>
                  {isRegistering ? 'Login' : 'Register'}
                </h4>
                <h6 className="or">or</h6>     
                <GoogleLogin
                onSuccess={responseGoogle}
                onError={(error) => console.error(error)}
                buttonText="Login with Google"
              />
              </div>
            </div>
          </div>
        </div>
        <div className="register-container">
        <div className="register-title">
          {isRegistering ? 'Create Account' : 'Login'}
        </div>
        <div className="register-form-container">
          {isRegistering ? (
            <RegistrationForm
              formData={formData}
              handleInputChange={handleInputChange}
              register={register}
            />
          ) : (
            <LoginForm
              formData={formData}
              handleInputChange={handleInputChange}
              login={login}
            />
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessages && (
            <div className="error-message">{errorMessages}</div>
          )}
        </div>
      </div>
      </div>
    </div>
   
  );
};

export default LandingPage;
