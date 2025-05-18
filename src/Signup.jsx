import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    // 🔐 Fake save to localStorage
    localStorage.setItem(
      "droxion_user",
      JSON.stringify({ username: name, email })
    );

    alert("✅ Account created successfully!");
    navigate("/dashboard"); // auto-login and redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="Your full name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="example@droxion.com"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="Create a strong password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 py-2 rounded hover:bg-green-600"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account? <span className="underline cursor-pointer" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
