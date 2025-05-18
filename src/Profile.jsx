import React, { useState } from "react";

function Profile() {
  const stored = JSON.parse(localStorage.getItem("droxion_user")) || {
    username: "Dhruv",
    email: "",
    password: ""
  };

  const [username, setUsername] = useState(stored.username);
  const [email, setEmail] = useState(stored.email);
  const [password, setPassword] = useState(stored.password);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const updatedUser = { username, email, password };
    localStorage.setItem("droxion_user", JSON.stringify(updatedUser));
    alert("✅ Profile saved (mock only)");
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">👤 Profile Settings</h1>

      <div className="max-w-xl space-y-6 bg-[#1f2937] p-6 rounded-lg shadow border border-gray-600">
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              avatar ||
              "https://ui-avatars.com/api/?name=" + username + "&background=0D8ABC&color=fff"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover shadow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 rounded text-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 rounded text-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 rounded text-black pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 text-xs text-gray-600 bg-white px-2 py-1 rounded"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-white font-semibold"
        >
          💾 Save Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
