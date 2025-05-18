import React, { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/videos")
      .then((res) => {
        const reversed = res.data.reverse();
        setProjects(reversed);
        setOriginalProjects(reversed);
      })
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  const filterByTopic = (topic) => {
    if (topic === "all") {
      setProjects(originalProjects);
    } else {
      const filtered = originalProjects.filter((p) => p.topic === topic);
      setProjects(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">📁 Your Projects</h1>

      {/* Topic Filter */}
      <div className="flex justify-end mb-6">
        <select
          onChange={(e) => filterByTopic(e.target.value)}
          className="text-black px-3 py-2 rounded"
        >
          <option value="all">📂 All Topics</option>
          {[...new Set(originalProjects.map((p) => p.topic))].map((topic) => (
            <option key={topic} value={topic}>
              🎯 {topic}
            </option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No videos yet. Generate one first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#1e293b] p-4 rounded-lg shadow hover:shadow-xl transition duration-200"
            >
              <video
                src={`/${project.filename}`}
                controls
                className="w-full h-56 rounded mb-3"
              />
              <h2 className="font-semibold text-lg text-white line-clamp-1">{project.topic}</h2>
              <p className="text-sm text-gray-400 mb-1">📅 {project.date}</p>
              <div className="flex gap-2 mt-2">
                <a
                  href={`/${project.filename}`}
                  download
                  className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  ⬇️ Download
                </a>
                <a
                  href={`/${project.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-500 px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  ▶️ View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
