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

const baseURL = "https://gastos-ko-server.vercel.app/api/users";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
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
          setUserId(response.data.userId);
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
      <Sidebar authenticated={authenticated}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/all" element={<All />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/today" element={<Today userId={userId} />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
