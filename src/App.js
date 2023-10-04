import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/Settings.jsx";
import Today from "./pages/Today.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Account from "./pages/Account.jsx";
import All from "./pages/All.jsx";
import Budget from "./pages/Budget.jsx";
import axios from "axios";

const baseURL = "http://localhost:5050/api/users";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      axios
        .get(`${baseURL}/currentUser`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log("Token validation response:", response.data);
          setAuthenticated(true);
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {authenticated && (
          <Route
            path="/dashboard"
            element={
              <Sidebar>
                <Dashboard />
              </Sidebar>
            }
          />
        )}
        {authenticated && (
          <Route
            path="/account"
            element={
              <Sidebar>
                <Account />
              </Sidebar>
            }
          />
        )}
        {authenticated && (
          <Route
            path="/all"
            element={
              <Sidebar>
                <All />
              </Sidebar>
            }
          />
        )}
        {authenticated && (
          <Route
            path="/budget"
            element={
              <Sidebar>
                <Budget />
              </Sidebar>
            }
          />
        )}
        {authenticated && (
          <Route
            path="/settings"
            element={
              <Sidebar>
                <Settings />
              </Sidebar>
            }
          />
        )}
        {authenticated && (
          <Route
            path="/today"
            element={
              <Sidebar>
                <Today />
              </Sidebar>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
