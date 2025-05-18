import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ make sure App.jsx is exactly this name
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
