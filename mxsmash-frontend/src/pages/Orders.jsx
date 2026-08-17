import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  pending: "text-yellow-400",
  confirmed: "text-blue-400",
  preparing: "text-orange-400",
  out_for_delivery: "text-purple-400",
  delivered: "text-green-400",
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  // Not logged in
  if (!user) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-2">Please log in</h1>
          <p className="text-gray-400 mb-6">Log in to view your order history.</p>
          <Link
            to="/login"
            className="inline-block bg-[#d4a437] text-black font-bold px-8 py-3 rounded-full hover:bg-[#c4941f] transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">My Orders</h1>

        {loading && <p className="text-gray-400">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/menu"
              className="inline-block bg-[#d4a437] text-black font-bold px-8 py-3 rounded-full hover:bg-[#c4941f] transition"
            >
              Browse Menu
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/order-tracking/${order.id}`}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#d4a437]/30 transition-all"
            >
              <div>
                <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} · ₦
                  {order.totalAmount.toLocaleString()}
                </p>
                <p className={`text-sm font-medium mt-1 ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;