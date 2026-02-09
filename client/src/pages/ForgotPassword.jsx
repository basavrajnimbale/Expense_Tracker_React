import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/password/forgot-password", { email });

      setMessage(res.data.message || "Password reset link sent to your email");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        {message && (
          <p className="bg-green-600 p-2 rounded mb-3 text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-600 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-4 rounded bg-gray-700 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
