import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Topbar({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user on mount and refresh on credit update
  useEffect(() => {
    const storedUser = localStorage.getItem("droxion_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const handleCreditUpdate = () => {
      const updatedUser = localStorage.getItem("droxion_user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("credits_updated", handleCreditUpdate);
    return () => window.removeEventListener("credits_updated", handleCreditUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("droxion_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-56 right-0 h-16 ${darkMode ? "bg-[#111827] border-gray-700" : "bg-gray-100 border-gray-300"} flex items-center justify-between px-6 border-b z-50`}>
      {/* 🔍 Search */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="🔍 Search videos, topics..."
          className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} px-4 py-2 rounded w-64 outline-none border border-gray-500`}
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* 🌐 Language */}
        <select
          className="bg-white text-black px-2 py-1 rounded outline-none"
          onChange={(e) => {
            localStorage.setItem("droxion_lang", e.target.value);
            window.dispatchEvent(new Event("droxion_lang_change"));
          }}
        >
          <option value="English">English 🇺🇸</option>
          <option value="Hindi">Hindi 🇮🇳</option>
          <option value="Gujarati">Gujarati 🇮🇳</option>
          <option value="Spanish">Spanish 🇪🇸</option>
        </select>

        {/* 🌓 Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sm px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          {darkMode ? "☀️ Day" : "🌙 Night"}
        </button>

        {/* 👤 Profile + credits */}
        <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className={`${darkMode ? "text-white" : "text-black"} font-medium`}>
              {user?.username ? `Hi, ${user.username}` : "Guest"}
            </span>
            {user?.credits !== undefined && (
              <span className="text-xs text-green-400 font-semibold">
                🎯 {user.credits} credits
              </span>
            )}
          </div>
        </Link>

        {/* 🔓 Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Topbar;
