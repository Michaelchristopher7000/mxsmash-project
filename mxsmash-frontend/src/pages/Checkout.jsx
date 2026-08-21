import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Phone, ArrowRight, ShoppingBag } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Owner's WhatsApp number - keep in sync with WhatsAppButton.jsx
// TODO: Replace with the real Mxsmash Burger owner's number before launch
const OWNER_WHATSAPP = "2349135550449";

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to menu if cart is empty (nothing to check out)
  if (cart.length === 0) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">
            Add something before checking out.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-[#d4a437] text-black font-bold px-8 py-3 rounded-full hover:bg-[#c4941f] transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (orders require a logged-in user)
  if (!user) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-2">Please log in to continue</h1>
          <p className="text-gray-400 mb-6">
            You need an account to place an order.
          </p>
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

  // Builds the WhatsApp message summarizing the order
  const buildWhatsAppMessage = (order) => {
    const itemLines = cart
      .map((item) => {
        const addOnsText =
          item.selectedAddOns && item.selectedAddOns.length > 0
            ? ` (${item.selectedAddOns.map((a) => a.name).join(", ")})`
            : "";
        return `• ${item.quantity}x ${item.name}${addOnsText} — ₦${(
          item.unitPrice * item.quantity
        ).toLocaleString()}`;
      })
      .join("\n");

    return `New Order from Mxsmash website!\n\nOrder ID: ${order.id}\n\n${itemLines}\n\nTotal: ₦${order.totalAmount.toLocaleString()}\n\nDelivery Address: ${deliveryAddress}\nPhone: ${phone}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Build the items payload the backend expects
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        selectedAddOnIds: (item.selectedAddOns || []).map((a) => a.id),
      }));

      // Create the real order in the database
      const { data: order } = await api.post("/orders", {
        items,
        deliveryAddress,
        phone,
      });

      // Clear the cart now that the order is successfully saved
      clearCart();

      // Build and open the WhatsApp message with the order summary
      const message = buildWhatsAppMessage(order);
      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      // Redirect to the order tracking page
      navigate(`/order-tracking/${order.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Delivery form */}
          <div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                  <MapPin className="w-4 h-4 text-[#d4a437]" />
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g. 12 Admiralty Way, Lekki Phase 1"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 font-medium mb-2">
                  <Phone className="w-4 h-4 text-[#d4a437]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g. 08012345678"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-4 rounded-full hover:bg-[#c4941f] transition-all shadow-xl text-lg disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order via WhatsApp"}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to WhatsApp to confirm payment with us
                directly.
              </p>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-400">
                      {item.quantity}x {item.name}
                      {item.selectedAddOns &&
                        item.selectedAddOns.length > 0 && (
                          <span className="text-gray-600">
                            {" "}
                            ({item.selectedAddOns.map((a) => a.name).join(", ")}
                            )
                          </span>
                        )}
                    </span>
                    <span className="text-white font-medium">
                      ₦{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-4">
                <span>Total</span>
                <span className="text-[#d4a437]">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
