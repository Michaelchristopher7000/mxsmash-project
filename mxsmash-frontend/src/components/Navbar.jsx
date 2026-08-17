import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const activeClass = ({ isActive }) => {
    const base = "font-bold uppercase tracking-[0.15em] text-[11px] lg:text-xs transition-colors";
    return isActive
      ? `${base} text-[#d4a437]`
      : `${base} text-white/80 hover:text-[#d4a437]`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo - Made larger and more prominent */}
        <Link to="/" className="flex items-center hover:scale-105 transition-transform">
          <img
            src="/mxsmash-logo.png"
            alt="MX Smash Burger"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-xl"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={activeClass}>Home</NavLink>
          <NavLink to="/menu" className={activeClass}>Menu</NavLink>
          <NavLink to="/about" className={activeClass}>About</NavLink>
          <NavLink to="/contact" className={activeClass}>Contact</NavLink>
          <NavLink to="/track" className={activeClass}>Track Order</NavLink>

          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-6 h-6 text-white/80 group-hover:text-[#d4a437] transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4a437] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="text-[#d4a437] font-bold hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="text-white/80 hover:text-[#d4a437] transition-colors"
                >
                  {user.name}
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm text-white/60 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={activeClass}>Login</NavLink>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-4 flex flex-col gap-3">
          <NavLink to="/" onClick={closeMenu} className={activeClass}>Home</NavLink>
          <NavLink to="/menu" onClick={closeMenu} className={activeClass}>Menu</NavLink>
          <NavLink to="/about" onClick={closeMenu} className={activeClass}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={activeClass}>Contact</NavLink>
          <NavLink to="/track" onClick={closeMenu} className={activeClass}>Track Order</NavLink>
          <Link
            to="/cart"
            onClick={closeMenu}
            className="text-white/80 hover:text-[#d4a437] transition-colors flex items-center gap-2"
          >
            Cart{" "}
            <span className="text-sm bg-[#d4a437] text-black px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </Link>
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="text-[#d4a437] font-bold hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="text-white/80 hover:text-[#d4a437] transition-colors"
                >
                  {user.name}
                </Link>
              )}
              <button
                onClick={() => { logout(); closeMenu(); }}
                className="text-left text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={closeMenu} className={activeClass}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;