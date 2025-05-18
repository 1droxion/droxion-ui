// ✅ Full AIImage.jsx with credit deduction after generation

import React, { useState } from "react";
import axios from "axios";

function AIImage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    const user = JSON.parse(localStorage.getItem("droxion_user"));
    if (!user || user.credits < 1) {
      alert("❌ Not enough credits. Please upgrade your plan.");
      return;
    }

    if (!prompt.trim()) return alert("Please enter a prompt.");

    setLoading(true);
    setImageUrl("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json"
          }
        }
      );

      setImageUrl(response.data.data[0].url);

      // ✅ Deduct 1 credit after success
      user.credits -= 1;
      localStorage.setItem("droxion_user", JSON.stringify(user));

    } catch (err) {
      console.error(err);
      alert("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold text-green-400 mb-4">🧠 Generate AI Image</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your image prompt..."
        className="w-full p-3 rounded text-black mb-4"
      />

      <button
        onClick={generateImage}
        disabled={loading}
        className="bg-blue-500 px-6 py-2 rounded text-white hover:bg-blue-600"
      >
        {loading ? "Generating..." : "🎨 Generate Image"}
      </button>

      {imageUrl && (
        <div className="mt-6 text-center">
          <img
            src={imageUrl}
            alt="Generated AI"
            className="max-w-full mx-auto rounded shadow-md mb-4"
          />
          <a
            href={imageUrl}
            download
            className="inline-block bg-purple-600 px-4 py-2 rounded text-white"
          >
            ⬇️ Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default AIImage;
