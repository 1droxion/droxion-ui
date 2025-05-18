import React, { useState } from "react";

function Editor() {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [audios, setAudios] = useState([]);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "video") setVideos([...videos, ...files]);
    else if (type === "image") setImages([...images, ...files]);
    else if (type === "audio") setAudios([...audios, ...files]);
  };

  const handleSubmit = () => {
    alert("🛠️ AI Editing coming soon...");
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">🎞️ AI Upload Editor</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🎬 Video Upload */}
        <div className="bg-[#1f2937] p-4 rounded-lg shadow border border-gray-700">
          <h2 className="font-semibold text-lg mb-2">📤 Upload Videos</h2>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileChange(e, "video")}
            className="w-full text-black bg-white rounded p-2"
          />
          <div className="mt-4 space-y-2">
            {videos.map((v, i) => (
              <div key={i} className="bg-black/20 p-2 rounded text-sm truncate">
                🎬 {v.name}
              </div>
            ))}
          </div>
        </div>

        {/* 🖼️ Image Upload */}
        <div className="bg-[#1f2937] p-4 rounded-lg shadow border border-gray-700">
          <h2 className="font-semibold text-lg mb-2">🖼 Upload Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "image")}
            className="w-full text-black bg-white rounded p-2"
          />
          <div className="mt-4 space-y-2">
            {images.map((img, i) => (
              <div key={i} className="bg-black/20 p-2 rounded text-sm truncate">
                🖼 {img.name}
              </div>
            ))}
          </div>
        </div>

        {/* 🎧 Music Upload */}
        <div className="bg-[#1f2937] p-4 rounded-lg shadow border border-gray-700">
          <h2 className="font-semibold text-lg mb-2">🎧 Upload Music</h2>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => handleFileChange(e, "audio")}
            className="w-full text-black bg-white rounded p-2"
          />
          <div className="mt-4 space-y-2">
            {audios.map((a, i) => (
              <div key={i} className="bg-black/20 p-2 rounded text-sm truncate">
                🎵 {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 text-white rounded-lg text-lg font-semibold shadow-md transition"
        >
          🚀 Submit for AI Editing
        </button>
      </div>
    </div>
  );
}

export default Editor;
