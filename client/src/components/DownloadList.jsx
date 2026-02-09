import { useState } from "react";
import api from "../services/api";

export default function DownloadList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await api.get("/expense/download", { headers: { Authorization: token }, });
      // Add new file to list
      setFiles((prev) => [
        { url: data.fileURL, name: data.filename },
        ...prev,
      ]);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Downloads
      </h2>

      <button
        onClick={handleDownload}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
      >
        {loading ? "Preparing..." : "Download Expense CSV"}
      </button>

      <ul className="mt-4 space-y-2">
        {files.map((file, index) => (
          <li key={index} className="bg-gray-700 p-2 rounded">
            <a
              href={file.url}
              download
              className="text-blue-400 underline"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
