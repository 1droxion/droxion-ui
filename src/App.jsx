import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Analytics from "./Analytics";
import Settings from "./Settings";
import Editor from "./Editor";
import Plans from "./Plans";
import Templates from "./Templates";
import Connect from "./Connect";
import { Privacy, Terms, Support } from "./StaticPages";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import AIChat from "./AIChat";
import AIImage from "./AIImage";
import AIStyle from "./AIStyle";
import ProtectedRoute from "./ProtectedRoute";
import Generator from "./Generator";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <div className={`min-h-screen flex ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Sidebar />
        <div className="flex flex-col flex-grow ml-56">
          <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="pt-20 p-6">
            <Routes>
              {/* 🔐 Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
              <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
              <Route path="/ai-image" element={<ProtectedRoute><AIImage /></ProtectedRoute>} />
              <Route path="/ai-style" element={<ProtectedRoute><AIStyle /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
              <Route path="/connect" element={<ProtectedRoute><Connect /></ProtectedRoute>} />

              {/* 🌐 Public Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
