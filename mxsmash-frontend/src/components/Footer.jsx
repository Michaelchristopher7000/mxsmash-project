import { Link } from "react-router-dom";
import { ChefHat, Clock, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/5 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="hover:text-[#d4a437] transition-colors">Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d4a437] transition-colors">About</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-[#d4a437] transition-colors">Delivery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4a437] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Hours & Location */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#d4a437] mt-0.5" />
                <div>
                  <p>Mon – Sun: 11am – 10pm</p>
                  <p className="text-sm text-gray-500">Lekki, Lagos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d4a437] mt-0.5" />
                <div>
                  <p>Lekki Phase 1, Lagos</p>
                  <p className="text-sm text-gray-500">Delivering across Lekki</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#d4a437] mt-0.5" />
                <div>
                  <p>+234 913 282 7053</p>
                  <p className="text-sm text-gray-500">Call or chat for quick orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect / Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.tiktok.com/@mxsmash_ng?_r=1&_t=ZS-98xWZmHhOse"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#d4a437] hover:text-black flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              {/* <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#d4a437] hover:text-black flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a> */}
              <a
                href=" https://www.instagram.com/mxsmash_ng?igsh=djNreGZqODg2a28w&utm_source=qr"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#d4a437] hover:text-black flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#d4a437] hover:text-black flex items-center justify-center transition-all"
                aria-label="Chef"
              >
                <ChefHat className="w-5 h-5" />
              </a>
            </div>
            {/* Order Now button */}
            <div className="mt-6">
              <Link
                to="/menu"
                className="inline-block bg-[#d4a437] text-black font-bold px-6 py-3 rounded-full hover:bg-[#c4941f] transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="text-center md:text-left">
            Premium smash burgers delivered fast in Lekki. Fresh, bold, and built for repeat orders.
          </p>
          <p className="text-center md:text-right">
            &copy; {new Date().getFullYear()} MX Smash. All rights reserved. Premium Smash Burgers in Lekki, Lagos.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;