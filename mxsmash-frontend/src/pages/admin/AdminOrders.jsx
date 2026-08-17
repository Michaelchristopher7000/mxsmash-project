import { useState, useEffect } from "react";
import { ClipboardList, ChevronDown } from "lucide-react";
import api from "../../api/axios";

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};
const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  out_for_delivery: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/all");
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // Update the order in local state instead of refetching everything
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-1">Orders</h1>
        <p className="text-gray-400">View and manage customer orders</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
          <ClipboardList className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 border border-white/5 rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-white">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {order.user?.name} · {order.phone}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status dropdown */}
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={`appearance-none pl-4 pr-9 py-2 rounded-full text-sm font-bold border cursor-pointer focus:outline-none ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} className="bg-[#141414] text-white">
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Order items */}
              <div className="border-t border-white/5 pt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.quantity}x {item.product?.name}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <span className="text-gray-600">
                          {" "}
                          ({item.selectedAddOns.map((a) => a.name).join(", ")})
                        </span>
                      )}
                    </span>
                    <span className="text-white">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                <span className="text-gray-400 text-sm">{order.deliveryAddress}</span>
                <span className="text-[#d4a437] font-bold">
                  ₦{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;