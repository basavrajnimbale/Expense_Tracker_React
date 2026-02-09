import { useState } from "react";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await api.get("/premium/showLeaderBoard", {
        headers: { Authorization: token },
      });

      setUsers(data);
      setShow(true);
    } catch (error) {
      console.error("Failed to load leaderboard", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Leaderboard
      </h2>

      {!show && (
        <button
          onClick={fetchLeaderboard}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          Show Leaderboard
        </button>
      )}

      {loading && (
        <p className="text-gray-400 mt-3">Loading...</p>
      )}

      {show && !loading && (
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-gray-700 p-3 rounded text-gray-200"
            >
              <span className="font-semibold">
                {user.name}
              </span>{" "}
              — ₹{user.totalExpenses}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
