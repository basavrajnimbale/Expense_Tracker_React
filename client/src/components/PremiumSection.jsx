import { useEffect, useState } from "react";
import api from "../services/api";
import Leaderboard from "./Leaderboard";
import DownloadList from "./DownloadList";

export default function PremiumSection() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // Decode JWT (same logic you used earlier)
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.ispremiumuser) {
      setIsPremium(true);
    }
  }, []);

  async function buyPremium() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // 1️⃣ Create order
      const { data } = await api.get("/purchase/premiummembership", {
        headers: { Authorization: token },
      });

      const options = {
        key: data.key_id,
        order_id: data.order.id,
        handler: async function (response) {
          // 2️⃣ Update transaction status
          const res = await api.post(
            "/purchase/updatetransactionstatus",
            {
              order_id: data.order.id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );

          // 3️⃣ Save new token & update UI
          localStorage.setItem("token", res.data.token);
          setIsPremium(true);
          alert("🎉 You are a Premium User now!");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        alert("❌ Payment failed. Try again.");
      });
    } catch (error) {
      console.log("Premium purchase failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Premium Features
      </h2>

      {!isPremium ? (
        <button
          onClick={buyPremium}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold"
        >
          {loading ? "Processing..." : "Buy Premium"}
        </button>
      ) : (
        <p className="text-green-400 font-semibold mb-4">
          ⭐ You are a Premium User
        </p>
      )}

      {/* Premium-only features */}
      {isPremium && (
        <div className="mt-6 space-y-6">
          <DownloadList />
          <Leaderboard />
        </div>
      )}
    </div>
  );
}
