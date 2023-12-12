import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="526409114070-ebim8ffco6a4kchhmflkut414jhs9ii5.apps.googleusercontent.com">
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GoogleOAuthProvider>
  </StrictMode>,
  document.getElementById("root")
);
