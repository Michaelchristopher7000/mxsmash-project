import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Sandwich, ArrowRight, Pencil } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added anything yet.
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

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Your Cart</h1>

        {/* Cart items list */}
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div
              key={item.cartKey}
              className="flex gap-4 bg-white/5 border border-white/5 rounded-2xl p-4"
            >
              {/* Item image */}
              <div className="w-20 h-20 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sandwich className="w-8 h-8 text-[#d4a437]/40" />
                  </div>
                )}
              </div>

              {/* Item details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Customize button */}
                    <Link
                      to={`/product/${item.id}`}
                      className="text-gray-500 hover:text-[#d4a437] transition-colors"
                      aria-label={`Customize ${item.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Selected add-ons, if any */}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.selectedAddOns.map((a) => a.name).join(", ")}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.cartKey, item.quantity - 1)
                          : removeFromCart(item.cartKey)
                      }
                      className="text-white hover:text-[#d4a437] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="text-white hover:text-[#d4a437] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="text-[#d4a437] font-bold">
                    ₦{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2 text-gray-400">
            <span>Subtotal</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Delivery fee calculated at checkout
          </p>
          <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-4">
            <span>Total</span>
            <span className="text-[#d4a437]">₦{totalAmount.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-4 rounded-full hover:bg-[#c4941f] transition-all shadow-xl text-lg mt-6"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </button>

          <Link
            to="/menu"
            className="block text-center text-gray-400 hover:text-[#d4a437] transition-colors mt-4 text-sm"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;