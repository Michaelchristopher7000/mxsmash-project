// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../api/axios";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail(""); // clear after success
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-[#0d0d0d]/60" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#d4a437]/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#d4a437]/10 blur-3xl animate-pulse animation-delay-500" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up mt-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-[#d4a437]/30 transition-all duration-300">
          <div className="text-center mb-8">
            <img
              src="/mxsmash-logo.png"
              alt="MX Smash"
              className="h-12 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-1">
              We'll send you a link to reset your password
            </p>
          </div>

          {message && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-3.5 rounded-xl hover:bg-[#c4941f] transition-all shadow-lg hover:shadow-[#d4a437]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a437] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
