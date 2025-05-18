import React, { useState } from "react";
import axios from "axios";

function AIStyle() {
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState("Ghibli");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const transformImage = async () => {
    if (!image) return alert("Please upload an image.");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/transform", {
        image,
        style,
      });
      setResult(res.data.result);
    } catch (err) {
      alert("Error transforming image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🖼️ AI Style Transformer</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input type="file" accept="image/*" onChange={handleUpload} />
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="p-2 rounded text-black"
        >
          <option value="Ghibli">Ghibli</option>
          <option value="Cartoon">Cartoon</option>
          <option value="Pixel">Pixel</option>
          <option value="Fantasy">Fantasy</option>
        </select>
        <button
          onClick={transformImage}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🎨 Transform
        </button>
      </div>

      {loading && <p className="mt-4 text-yellow-400">Processing...</p>}

      {result && (
        <div className="mt-6">
          <img src={result} alt="Styled Output" className="max-w-full rounded" />
          <a
            href={result}
            download="styled_image.png"
            className="block mt-2 text-blue-400 underline"
          >
            ⬇️ Download
          </a>
        </div>
      )}
    </div>
  );
}

export default AIStyle;
