import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Sandwich, Minus, Plus, ArrowLeft, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      setQuantity(1);
      setSelectedAddOns([]); // reset add‑ons when product changes
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add‑on handlers
  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product ? product.price + addOnsTotal : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedAddOns);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 animate-pulse">
          <div className="aspect-square bg-gray-800 rounded-3xl mb-8" />
          <div className="h-8 w-2/3 bg-gray-800 rounded mb-4" />
          <div className="h-4 w-full bg-gray-800 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !product) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-3">Product not found</h1>
          <p className="text-gray-400 mb-6">
            This item may have been removed from the menu.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-[#d4a437] text-black font-bold px-6 py-3 rounded-full hover:bg-[#c4941f] transition"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-[#d4a437] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Product image */}
          <div className="aspect-square bg-gray-800 rounded-3xl overflow-hidden relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <Sandwich className="w-24 h-24 text-[#d4a437]/40" />
              </div>
            )}
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-[#d4a437] text-black text-xs font-black px-3 py-1.5 rounded-full tracking-wide uppercase">
                Best Seller
              </span>
            )}
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-[#d4a437] mb-6">
              ₦{product.price.toLocaleString()}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              {product.description || "No description available."}
            </p>

            {/* Add‑ons section */}
            {product.addOns && product.addOns.length > 0 && (
              <div className="mb-8">
                <h3 className="text-gray-400 font-medium mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {product.addOns.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-[#d4a437]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.some(
                            (a) => a.id === addon.id,
                          )}
                          onChange={() => toggleAddOn(addon)}
                          className="w-4 h-4 accent-[#d4a437]"
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-[#d4a437] font-medium">
                        {addon.price > 0
                          ? `+₦${addon.price.toLocaleString()}`
                          : "Free"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability warning */}
            {!product.isAvailable && (
              <p className="text-red-400 font-medium mb-6">
                Currently unavailable
              </p>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-400 font-medium">Quantity</span>
              <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-white hover:text-[#d4a437] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-white hover:text-[#d4a437] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to cart button (price now includes add‑ons) */}
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-4 rounded-full hover:bg-[#c4941f] transition-all shadow-xl text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {justAdded
                ? "Added to Cart!"
                : `Add to Cart — ₦${(unitPrice * quantity).toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
