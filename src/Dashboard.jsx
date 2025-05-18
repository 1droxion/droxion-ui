import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterTopic, setFilterTopic] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:5000/videos")
      .then((res) => {
        const data = res.data.reverse();
        setVideos(data);
        setFilteredVideos(data);
      })
      .catch((err) => console.error("Failed to load videos:", err));
  }, []);

  useEffect(() => {
    let filtered = [...videos];

    if (filterTopic !== "All") {
      filtered = filtered.filter((v) =>
        v.topic.toLowerCase() === filterTopic.toLowerCase()
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((v) =>
        v.filename.toLowerCase().includes(search.toLowerCase()) ||
        v.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === "oldest") {
      filtered = filtered.slice().reverse();
    }

    setFilteredVideos(filtered);
  }, [search, sortOrder, filterTopic, videos]);

  const deleteVideo = async (filename) => {
    if (!window.confirm("Delete this video?")) return;
    await axios.delete(`http://localhost:5000/delete/${filename}`);
    setVideos(videos.filter((v) => v.filename !== filename));
  };

  const uniqueTopics = ["All", ...new Set(videos.map((v) => v.topic))];

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">📂 Your Generated Reels</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="🔍 Search by topic or filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📆 Oldest First</option>
        </select>

        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          {uniqueTopics.map((t, i) => (
            <option key={i} value={t}>
              🏷 {t}
            </option>
          ))}
        </select>
      </div>

      {filteredVideos.length === 0 ? (
        <p className="text-gray-400">No videos match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <div key={index} className="bg-[#1e293b] rounded-lg shadow-md p-4 border border-gray-700">
              <video
                src={`/${video.filename}`}
                controls
                className="w-full h-52 rounded mb-3"
              />
              <div className="mb-2">
                <p className="font-semibold text-lg">🎯 {video.topic}</p>
                <p className="text-sm text-gray-400">📅 {video.date}</p>
              </div>
              <div className="flex justify-between gap-2">
                <a
                  href={`/${video.filename}`}
                  download
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm text-white py-1 rounded text-center"
                >
                  ⬇️ Download
                </a>
                <button
                  onClick={() => deleteVideo(video.filename)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-sm text-white py-1 rounded"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
