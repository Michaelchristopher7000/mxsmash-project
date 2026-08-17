import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  ClipboardList,
  LogOut,
  Shield,
  ShoppingBag,
  Calendar,
  Edit,
  Lock,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ── Standalone Favourite Burger Card ────────────────────────────────────────
const FavouriteBurgerCard = ({ user, products, onSave }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(user?.favoriteBurger || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.favoriteBurger) {
      setSelected(user.favoriteBurger);
    }
  }, [user?.favoriteBurger]);

  const handleSave = async (burgerName) => {
    const burgerToSave = burgerName !== undefined ? burgerName : selected;
    setSaving(true);
    await onSave(burgerToSave);
    setSaving(false);
    setOpen(false);
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8 hover:border-[#d4a437]/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
            🍔
          </div>
          <div>
            <p className="font-bold text-white text-sm">Favourite Burger</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {user?.favoriteBurger ? user.favoriteBurger : "You haven't picked one yet!"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelected(user?.favoriteBurger || "");
            setOpen((o) => !o);
          }}
          className="flex items-center gap-1.5 bg-[#d4a437]/10 hover:bg-[#d4a437]/20 text-[#d4a437] text-xs font-bold px-3.5 py-2 rounded-full transition-all border border-[#d4a437]/20 hover:scale-105 active:scale-95"
        >
          <Heart className="w-3.5 h-3.5 fill-[#d4a437]" />
          {user?.favoriteBurger ? "Change" : "Pick One"}
        </button>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-gray-400 text-xs mb-3">Select your go-to burger from the menu:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {products.length === 0 && (
              <p className="text-gray-500 text-xs col-span-2 py-2">No burgers found or loading menu...</p>
            )}
            {products.map((p) => {
              const isSelected = selected === p.name;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#d4a437] bg-[#d4a437]/15 text-[#d4a437]"
                      : "border-white/10 bg-white/5 text-gray-300 hover:border-[#d4a437]/30 hover:text-white"
                  }`}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="text-xl flex-shrink-0">🍔</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">₦{Number(p.price).toLocaleString()}</p>
                  </div>
                  {isSelected && (
                    <span className="text-[#d4a437] font-bold text-base flex-shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleSave(selected)}
              disabled={saving || !selected}
              className="bg-[#d4a437] text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#c4941f] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Favourite"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-white/10 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const [stats, setStats] = useState({
    orderCount: 0,
    totalSpent: 0,
    memberSince: "",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", avatarUrl: "", favoriteBurger: "" });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        avatarUrl: user.avatarUrl || "",
        favoriteBurger: user.favoriteBurger || "",
      });
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list.filter((p) => p.isAvailable !== false));
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditForm((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await api.put("/users/profile", editForm);
      updateUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      const msg = error.response?.data?.message || error.response?.data?.detail || "Failed to update profile.";
      alert(msg);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [ordersRes] = await Promise.all([
          api.get("/orders/my-orders").catch(() => ({ data: [] })),
        ]);
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const memberSince = user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "N/A";

        setStats({
          orderCount: orders.length,
          totalSpent,
          memberSince,
        });
        setRecentOrders(orders.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-2">Please log in</h1>
          <p className="text-gray-400 mb-6">Log in to view your account.</p>
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

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-white">
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
          <div className="h-10 w-48 bg-white/5 rounded animate-pulse mb-8" />
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="h-6 w-32 bg-white/10 rounded mb-2" />
                <div className="h-4 w-48 bg-white/10 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <div className="h-8 w-16 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-3 w-20 bg-white/10 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">My Account</h1>

        {/* ========== PROFILE SUMMARY ========== */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-full flex-shrink-0 border-2 border-[#d4a437]/30 overflow-hidden bg-white/5 group">
                  {editForm.avatarUrl ? (
                    <img
                      src={editForm.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#d4a437] text-black font-extrabold text-2xl">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-xs font-bold">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>
                {uploadingAvatar && (
                  <span className="text-sm text-[#d4a437] animate-pulse">Uploading image...</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#d4a437] transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#d4a437]" /> Favourite Burger
                </label>
                <div className="relative">
                  <select
                    value={editForm.favoriteBurger}
                    onChange={(e) => setEditForm({ ...editForm, favoriteBurger: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d4a437] transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1a1a]">
                      — Pick your favourite —
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name} className="bg-[#1a1a1a]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    ▾
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-[#d4a437] text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c4941f] transition-all shadow-lg hover:shadow-[#d4a437]/20"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex-shrink-0 border-2 border-[#d4a437]/30 overflow-hidden bg-white/5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#d4a437] text-black font-extrabold text-xl">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {user.role === "admin" && (
                      <span className="inline-flex items-center gap-1 bg-[#d4a437]/10 text-[#d4a437] text-xs font-bold px-2.5 py-1 rounded-full">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-white/5 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      Member since {stats.memberSince}
                    </span>
                    {user.favoriteBurger && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full">
                        <Heart className="w-3 h-3 fill-red-400" />
                        {user.favoriteBurger}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-[#d4a437] transition-colors text-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
                <span className="text-gray-600">|</span>
                {/* Change Password link disabled for now - route doesn't exist yet, coming with Forgot Password feature */}
                <span className="flex items-center gap-1.5 text-gray-600 text-sm cursor-not-allowed" title="Coming soon">
                  <Lock className="w-3.5 h-3.5" />
                  Change Password
                </span>
              </div>
            </>
          )}
        </div>

        {/* ========== STATS ========== */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-[#d4a437]">{stats.orderCount}</div>
            <div className="text-gray-400 text-xs">Orders</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-[#d4a437]">
              ₦{stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs">Total Spent</div>
          </div>
        </div>

        {/* ========== FAVOURITE BURGER CARD ========== */}
        <FavouriteBurgerCard
          user={user}
          products={products}
          onSave={async (burgerName) => {
            try {
              const { data } = await api.put("/users/profile", { favoriteBurger: burgerName });
              updateUser(data);
            } catch (e) {
              console.error("Failed to update favourite burger:", e);
              alert(e.response?.data?.message || "Couldn't save favourite burger. Please try again.");
            }
          }}
        />

        {/* ========== RECENT ORDERS ========== */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-[#d4a437] text-sm hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">No orders yet</p>
              <Link
                to="/menu"
                className="inline-block text-[#d4a437] font-bold text-sm hover:underline mt-2"
              >
                Start ordering →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/order-tracking/${order.id}`}
                  className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#d4a437]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d4a437]/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-[#d4a437]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">#{order.orderNumber}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#d4a437]">
                      ₦{order.totalAmount.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "out_for_delivery"
                          ? "bg-purple-500/20 text-purple-400"
                          : order.status === "preparing"
                          ? "bg-orange-500/20 text-orange-400"
                          : order.status === "confirmed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ========== QUICK LINKS ========== */}
        <div className="space-y-3 mt-8">
          <Link
            to="/orders"
            className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#d4a437]/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-[#d4a437]" />
              <span className="font-medium">All Orders</span>
            </div>
            <span className="text-gray-500">→</span>
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#d4a437]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#d4a437]" />
                <span className="font-medium">Admin Dashboard</span>
              </div>
              <span className="text-gray-500">→</span>
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-red-500/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;