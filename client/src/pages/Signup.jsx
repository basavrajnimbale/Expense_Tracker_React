import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        console.log({formData});
      const response = await api.post("/user/signup", formData);
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submitHandler} className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Signup</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Signup
        </button>
        <p className="text-white mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
        </p>
      </form>
    </div>
  );
}
