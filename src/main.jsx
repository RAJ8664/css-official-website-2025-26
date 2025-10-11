import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </AuthProvider>
);
