import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Circle, MapPin, Phone, Package } from "lucide-react";
import api from "../api/axios";

// The order status flow, in order - used to render the progress steps
const STATUS_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError("Order not found or you don't have access to view it.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-2">Order not found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/menu"
            className="inline-block bg-[#d4a437] text-black font-bold px-8 py-3 rounded-full hover:bg-[#c4941f] transition"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-10">
          <Package className="w-12 h-12 text-[#d4a437] mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-extrabold">Order Confirmed!</h1>
          <p className="text-gray-400 mt-2">Order #{order.id.slice(0, 8)}</p>
        </div>

        {/* Status progress steps */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {STATUS_STEPS.map((step, index) => {
              const isComplete = index <= currentStepIndex;
              return (
                <div key={step} className="flex items-center gap-3">
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-[#d4a437] flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className={isComplete ? "text-white font-medium" : "text-gray-500"}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="font-bold mb-4">Order Details</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-white font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-4 mt-4">
            <span>Total</span>
            <span className="text-[#d4a437]">₦{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <div className="flex items-start gap-3 text-gray-300 mb-3">
            <MapPin className="w-5 h-5 text-[#d4a437] shrink-0 mt-0.5" />
            <p>{order.deliveryAddress}</p>
          </div>
          <div className="flex items-start gap-3 text-gray-300">
            <Phone className="w-5 h-5 text-[#d4a437] shrink-0 mt-0.5" />
            <p>{order.phone}</p>
          </div>
        </div>

        <Link
          to="/menu"
          className="block text-center text-gray-400 hover:text-[#d4a437] transition-colors mt-6 text-sm"
        >
          ← Order more
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;