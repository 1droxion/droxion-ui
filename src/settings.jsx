import React, { useState } from "react";

function Settings() {
  const [systemName, setSystemName] = useState("Droxion");
  const [defaultLang, setDefaultLang] = useState("Hindi");
  const [defaultVoice, setDefaultVoice] = useState("onyx");
  const [defaultStyle, setDefaultStyle] = useState("Cinematic");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert("✅ Settings saved (mock only). Connect to backend later!");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-8">⚙️ System Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Settings */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">📛 System Name</label>
            <input
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full p-3 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">🌐 Default Language</label>
            <select
              value={defaultLang}
              onChange={(e) => setDefaultLang(e.target.value)}
              className="w-full p-3 rounded text-black"
            >
              {["Hindi", "English", "Gujarati"].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">🎤 Default Voice</label>
            <select
              value={defaultVoice}
              onChange={(e) => setDefaultVoice(e.target.value)}
              className="w-full p-3 rounded text-black"
            >
              {["onyx", "shimmer", "nova", "echo", "fable"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">🎬 Default Style</label>
            <select
              value={defaultStyle}
              onChange={(e) => setDefaultStyle(e.target.value)}
              className="w-full p-3 rounded text-black"
            >
              {["Cinematic", "Emotional", "Funny", "Inspirational", "Aggressive"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Panel - Logo Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold mb-2">🖼 Upload System Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="block p-2 rounded bg-white text-black w-full"
          />
          {logoPreview && (
            <div className="mt-4">
              <p className="text-sm mb-2 text-green-300">✅ Preview:</p>
              <img src={logoPreview} alt="Logo Preview" className="h-32 rounded shadow-lg border border-gray-600" />
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded font-bold text-lg"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
