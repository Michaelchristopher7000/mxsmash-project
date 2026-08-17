import { useState } from "react";
import { Search, Package } from "lucide-react";
import api from "../api/axios";


const STATUS_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const { data } = await api.post("/orders/track", { orderNumber, phone });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-lg mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">Track Your Order</h1>
        <p className="text-gray-400 text-center mb-8">
          Enter your order number and phone to check your delivery status.
        </p>

        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Order number (e.g. MX-4821)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437]"
          />
          <input
            type="tel"
            placeholder="Phone number used at checkout"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-3.5 rounded-full hover:bg-[#c4941f] transition disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-center text-sm mb-6">{error}</p>
        )}

        {order && (
          <div>
            <div className="text-center mb-6">
              <Package className="w-10 h-10 text-[#d4a437] mx-auto mb-2" />
              <p className="font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
              {STATUS_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      index <= currentStepIndex ? "bg-[#d4a437]" : "bg-gray-700"
                    }`}
                  />
                  <span
                    className={
                      index <= currentStepIndex ? "text-white font-medium" : "text-gray-500"
                    }
                  >
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;