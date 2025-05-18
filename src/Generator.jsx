import React, { useState, useEffect } from "react";
import axios from "axios";

function Generator() {
  const [formData, setFormData] = useState({
    mode: "Manual",
    topic: "",
    language: "English",
    manualScript: "no",
    userScript: "",
    voice: "onyx",
    style: "Cinematic",
    length: "Medium",
    captions: "Word-by-Word",
    subtitlePosition: "Bottom",
    branding: "Yes",
    musicVolume: "Medium Volume",
    clipCount: 10,
    voiceSpeed: 1.0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const lang = localStorage.getItem("droxion_lang") || "English";
    setFormData((prev) => ({ ...prev, language: lang }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("droxion_user"));
    if (!user || user.credits < 1) {
      alert("❌ Not enough credits. Please upgrade your plan.");
      return;
    }

    setIsLoading(true);
    setVideoReady(false);
    setVideoUrl("");

    try {
      const res = await axios.post("http://localhost:5000/generate", formData);
      const { videoUrl } = res.data;
      setVideoUrl(videoUrl);
      setVideoReady(true);

      // Deduct credit
      user.credits -= 1;
      localStorage.setItem("droxion_user", JSON.stringify(user));
    } catch (err) {
      alert("❌ Error generating video: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-500 mb-6">🎬 Droxion AI Video Creator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {[
          { label: "Script Mode", name: "manualScript", options: ["no", "yes"] },
          { label: "Topic", name: "topic", type: "text" },
          {
            label: "Language", name: "language",
            options: ["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Bengali", "Punjabi"]
          },
          { label: "Voice", name: "voice", options: ["onyx", "shimmer", "nova", "echo", "fable"] },
          { label: "Style", name: "style", options: ["Cinematic", "Emotional", "Funny", "Inspirational", "Aggressive"] },
          { label: "Length", name: "length", options: ["Short", "Medium", "Long"] },
          { label: "Subtitle Style", name: "captions", options: ["Word-by-Word", "Line-by-Line"] },
          { label: "Subtitle Position", name: "subtitlePosition", options: ["Top", "Center", "Bottom"] },
          { label: "Add Branding", name: "branding", options: ["Yes", "No"] },
          { label: "Background Music Volume", name: "musicVolume", options: ["Low Volume", "Medium Volume", "High Volume"] },
        ].map((field) => (
          <div key={field.name}>
            <label className="text-sm font-medium">{field.label}:</label>
            {field.type === "text" ? (
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded text-black"
              />
            ) : (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded text-black"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div>
          <label className="text-sm font-medium">Number of Background Clips:</label>
          <input
            name="clipCount"
            type="number"
            value={formData.clipCount}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded text-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Voice Speed:</label>
          <input
            name="voiceSpeed"
            type="number"
            step="0.1"
            value={formData.voiceSpeed}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded text-black"
          />
        </div>

        {formData.manualScript === "yes" && (
          <div className="col-span-2">
            <label className="text-sm font-medium">📝 Your Custom Script:</label>
            <textarea
              name="userScript"
              rows="5"
              value={formData.userScript}
              onChange={handleChange}
              placeholder="Write your own script here..."
              className="w-full mt-1 p-2 rounded text-black"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-500 px-6 py-2 rounded hover:bg-green-600 text-white"
      >
        {isLoading ? "⚙️ Generating..." : "🎥 Generate Video"}
      </button>

      {videoReady && videoUrl && (
        <div className="mt-8 text-center">
          <video src={videoUrl} controls className="w-full max-w-md mb-4" />
          <div>
            <a
              href={videoUrl}
              download
              className="inline-block bg-blue-500 px-4 py-2 rounded mr-4"
            >⬇️ Download</a>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-500 px-4 py-2 rounded"
            >▶️ Watch Fullscreen</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Generator;
