import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // 💡 Fake login logic (replace with real API call)
    if (email === "admin@droxion.com" && password === "droxion123") {
      localStorage.setItem("droxion_user", JSON.stringify({ username: "Admin", email }));
      navigate("/dashboard"); // Redirect after login
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 py-2 rounded hover:bg-green-600"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-4">
          Forgot password? <span className="underline cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
