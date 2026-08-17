import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Sandwich, Plus } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const Menu = () => {
  // All products fetched from the backend
  const [products, setProducts] = useState([]);
  // All categories fetched from the backend, used for the filter pills
  const [categories, setCategories] = useState([]);
  // Currently selected category filter ("all" shows everything)
  const [activeCategory, setActiveCategory] = useState("all");
  // Search text typed by the user
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // Fetch products and categories once when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply both the category filter AND the search filter together
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.categoryId === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Quick-add straight from the grid, no need to open product detail
  const handleQuickAdd = (e, product) => {
    e.preventDefault(); // stop the Link navigation from firing since this button is inside a <Link>
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
     <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Our Menu</h1>
        <p className="text-gray-400 mb-8">
          Fresh smash burgers, wings, fries & combos
        </p>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] transition-colors"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === "all"
                ? "bg-[#d4a437] text-black"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === category.id
                  ? "bg-[#d4a437] text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white/5 rounded-3xl overflow-hidden border border-white/5"
              >
                <div className="aspect-[4/3] bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-2/3 bg-gray-700 rounded" />
                  <div className="h-4 w-full bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state - no results match filters */}
        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-16">
            No items match your search. Try a different filter.
          </p>
        )}

        {/* Product grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-[#d4a437]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a437]/10"
              >
                <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Sandwich className="w-14 h-14 text-[#d4a437]/40" />
                    </div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 bg-[#d4a437] text-black text-[10px] font-black px-3 py-1 rounded-full tracking-wide uppercase">
                      Best Seller
                    </span>
                  )}
                  {/* Quick-add button, floats bottom-right of the image */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="absolute bottom-3 right-3 bg-[#d4a437] hover:bg-[#c4941f] text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                    aria-label={`Quick add ${product.name}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white group-hover:text-[#d4a437] transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-[#d4a437] font-bold ml-3 shrink-0">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;