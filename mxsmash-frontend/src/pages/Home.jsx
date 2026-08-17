import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  Clock,
  MapPin,
  Star,
  Award,
  Flame,
  Sandwich,
  ChevronRight,
  Phone,
} from "lucide-react";
import api from "../api/axios";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
  "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80",
];

const STATS_IMAGES = [
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80",
  "https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&q=80",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
  "https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&q=80",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  // Intersection observers for each section
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [menuRef, menuInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [deliveryRef, deliveryInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/featured");
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/5 rounded-3xl overflow-hidden border border-white/5">
      <div className="aspect-[4/3] bg-gray-700" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-6 w-2/3 bg-gray-700 rounded" />
          <div className="h-6 w-1/4 bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-700 rounded" />
        <div className="h-10 w-full bg-gray-700 rounded-xl" />
      </div>
    </div>
  );

  // Helper to conditionally apply animation class
  const animClass = (inView, delay = 0) =>
    inView ? `animate-fade-in-up animation-delay-${delay}` : "opacity-0";

  return (
    <div className="bg-[#0d0d0d] text-white overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 transition-opacity duration-1000">
          <img
            src={HERO_IMAGES[heroIndex]}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />
        </div>

        {/* Floating images - no animation needed */}
        <img
          src={HERO_IMAGES[0]}
          alt=""
          className="hidden lg:block absolute -top-16 -left-16 w-56 h-56 rounded-full object-cover opacity-40 rotate-[-12deg] shadow-2xl"
        />
        <img
          src={HERO_IMAGES[1]}
          alt=""
          className="hidden lg:block absolute -top-12 -right-12 w-60 h-60 rounded-full object-cover opacity-40 rotate-[12deg] shadow-2xl"
        />
        <img
          src={HERO_IMAGES[2]}
          alt=""
          className="hidden lg:block absolute -bottom-16 -left-12 w-64 h-48 rounded-3xl object-cover opacity-40 rotate-[6deg] shadow-2xl"
        />
        <img
          src={HERO_IMAGES[3]}
          alt=""
          className="hidden lg:block absolute -bottom-12 -right-12 w-52 h-64 rounded-3xl object-cover opacity-40 rotate-[-6deg] shadow-2xl"
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-24 text-center">
          <span
            className={`inline-block bg-[#1a1a1a] text-[#d4a437] text-xs font-bold tracking-wider px-4 py-2 rounded-full mb-6 border border-[#d4a437]/30 transition-all duration-700 ${
              heroInView
                ? "animate-fade-in-down opacity-100"
                : "opacity-0 translate-y-[-20px]"
            }`}
          >
            #1 SMASH BURGERS IN LEKKI
          </span>
          <h1
            className={`text-4xl md:text-6xl font-extrabold mb-4 leading-tight transition-all duration-700 delay-100 ${
              heroInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Premium Smash Burgers,
            <br />
            <span className="text-[#d4a437]">Delivered Hot & Fast</span>
          </h1>
          <p
            className={`text-gray-300 text-lg mb-8 max-w-md mx-auto transition-all duration-700 delay-200 ${
              heroInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            No dulling — hot smash burgers, correct combos, delivered
            sharp-sharp to your door. Fresh, every single time.
          </p>
          <Link
            to="/menu"
            className={`inline-flex items-center gap-2 bg-[#d4a437] text-black font-bold px-10 py-4 rounded-full hover:bg-[#c4941f] transition-all shadow-xl text-lg hover:scale-105 active:scale-95 ${
              heroInView
                ? "animate-fade-in-up opacity-100 delay-300"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Order Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <div
            className={`flex flex-wrap items-center justify-center gap-6 mt-10 text-gray-300 text-sm transition-all duration-700 delay-400 ${
              heroInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4a437]" />
              30–45 min delivery
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4a437]" />
              Delivering across Lekki
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#d4a437] fill-[#d4a437]" />
              Loved by our customers
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section
        ref={featuresRef}
        className="py-16 md:py-24 bg-[#0d0d0d] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className={`text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-700 ${
                featuresInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              Why Choose Us
            </span>
            <h2
              className={`text-4xl md:text-5xl font-extrabold text-white mt-3 transition-all duration-700 delay-100 ${
                featuresInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              Built for the perfect bite
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Beef",
                desc: "100% fresh, hand-pressed beef patties. Smashed to perfection for that signature crust every single time.",
              },
              {
                icon: Clock,
                title: "Rapid Delivery",
                desc: "Your burger should arrive hot. We deliver across Lekki in 30–45 minutes, guaranteed fresh.",
              },
              {
                icon: Flame,
                title: "Signature Sauce",
                desc: "Our house-made Mxsmash sauce — smoky, tangy, and dangerously addictive on every bite.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className={`group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-[#d4a437]/30 ${
                  featuresInView
                    ? `animate-fade-in-up animation-delay-${(i + 2) * 100} opacity-100`
                    : "opacity-0 translate-y-[30px]"
                }`}
              >
                <div className="w-14 h-14 bg-[#d4a437] rounded-2xl flex items-center justify-center mb-6 text-black group-hover:rotate-12 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIVE MENU PREVIEW ============ */}
      <section
        ref={menuRef}
        className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className={`text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-700 ${
                menuInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              The Best Burgers in Lekki
            </span>
            <h2
              className={`text-4xl md:text-5xl font-extrabold text-white mt-3 transition-all duration-700 delay-100 ${
                menuInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              Crowd Favorites
            </h2>
          </div>

          {loading && (
            <div className="grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p className="text-center text-gray-500">
              Menu coming soon — check back shortly!
            </p>
          )}

          {!loading && products.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-[#d4a437]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a437]/10 ${
                    menuInView
                      ? `animate-scale-in animation-delay-${(index + 1) * 100} opacity-100`
                      : "opacity-0 scale-95"
                  }`}
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
                        <Sandwich className="w-16 h-16 text-[#d4a437]/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#d4a437] transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-[#d4a437] ml-4 shrink-0">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {product.description}
                    </p>
                    <Link
                      to={`/product/${product.id}`}
                      className="block text-center w-full py-3 bg-white/5 hover:bg-[#d4a437] hover:text-black text-white font-bold rounded-xl transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className={`inline-flex items-center gap-2 text-[#d4a437] font-bold text-lg hover:text-white transition-colors group ${
                menuInView
                  ? "animate-fade-in-up animation-delay-400 opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              View Full Menu
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    {/* ============ STATS / BRAND CREDIBILITY ============ */}
      <section
        ref={statsRef}
        className="relative py-16 md:py-24 bg-[#0d0d0d] border-t border-white/5 overflow-hidden"
      >
        {/* Floating images */}
        <img
          src={STATS_IMAGES[0]}
          alt=""
          className="hidden lg:block absolute -top-16 -left-16 w-48 h-48 rounded-full object-cover opacity-30 rotate-[-8deg] shadow-2xl"
        />
        <img
          src={STATS_IMAGES[1]}
          alt=""
          className="hidden lg:block absolute -top-12 -right-12 w-52 h-52 rounded-full object-cover opacity-30 rotate-[10deg] shadow-2xl"
        />
        <img
          src={STATS_IMAGES[2]}
          alt=""
          className="hidden lg:block absolute -bottom-14 -left-10 w-56 h-40 rounded-3xl object-cover opacity-30 rotate-[6deg] shadow-2xl"
        />
        <img
          src={STATS_IMAGES[3]}
          alt=""
          className="hidden lg:block absolute -bottom-10 -right-10 w-44 h-56 rounded-3xl object-cover opacity-30 rotate-[-6deg] shadow-2xl"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h2
            className={`text-4xl md:text-5xl font-extrabold text-white mb-4 transition-all duration-700 ${
              statsInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Better burgers, <span className="text-[#d4a437]">delivered fresh</span>
          </h2>
          <p
            className={`text-gray-400 text-lg max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              statsInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Hand-smashed patties and bold flavor, brought straight to your
            door across Lekki.
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 transition-all duration-700 delay-200 ${
              statsInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#d4a437]">
                15+
              </div>
              <div className="text-gray-400 mt-1">menu items</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#d4a437]">
                30–45
              </div>
              <div className="text-gray-400 mt-1">minutes delivery</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#d4a437]">
                Lekki
              </div>
              <div className="text-gray-400 mt-1">& surrounding areas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DELIVERY ZONES ============ */}
      <section
        ref={deliveryRef}
        className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className={`text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-700 ${
                deliveryInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              Fast & Fresh
            </span>
            <h2
              className={`text-4xl md:text-5xl font-extrabold text-white mt-3 transition-all duration-700 delay-100 ${
                deliveryInView
                  ? "animate-fade-in-up opacity-100"
                  : "opacity-0 translate-y-[20px]"
              }`}
            >
              We Deliver To You
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { area: "Lekki Phase 1", time: "30-40 min" },
              { area: "Chevron", time: "30-45 min" },
              { area: "Ikate", time: "35-45 min" },
              { area: "Victoria Island", time: "40-55 min" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white/5 border border-white/5 rounded-3xl p-6 text-center hover:border-[#d4a437]/30 transition-all hover:bg-white/10 ${
                  deliveryInView
                    ? `animate-scale-in animation-delay-${(i + 1) * 100} opacity-100`
                    : "opacity-0 scale-95"
                }`}
              >
                <Clock className="w-8 h-8 text-[#d4a437] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">{item.area}</h3>
                <p className="text-[#d4a437] font-medium">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT / SINGLE LOCATION ============ */}
      <section
        ref={contactRef}
        className="py-16 md:py-24 bg-[#0d0d0d] border-t border-white/5"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span
            className={`text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-700 ${
              contactInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[20px]"
            }`}
          >
            Get In Touch
          </span>
          <h2
            className={`text-4xl md:text-5xl font-extrabold text-white mt-3 mb-8 transition-all duration-700 delay-100 ${
              contactInView
                ? "animate-fade-in-up opacity-100"
                : "opacity-0 translate-y-[20px]"
            }`}
          >
            Order From Mxsmash
          </h2>
          <div
            className={`bg-white/5 border border-white/5 rounded-3xl p-8 inline-block text-left transition-all duration-700 delay-200 ${
              contactInView
                ? "animate-scale-in opacity-100"
                : "opacity-0 scale-95"
            }`}
          >
            <div className="flex items-start gap-3 text-gray-300 mb-4">
              <MapPin className="w-5 h-5 text-[#d4a437] shrink-0 mt-0.5" />
              <p>Based in Lekki, Lagos — delivering across the island</p>
            </div>
            <div className="flex items-start gap-3 text-gray-300">
              <Phone className="w-5 h-5 text-[#d4a437] shrink-0 mt-0.5" />
              <p>Message us on WhatsApp to place an order</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
