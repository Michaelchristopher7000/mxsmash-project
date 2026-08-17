import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sandwich, ClipboardList, Tag, TrendingUp, ArrowRight } from "lucide-react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/orders/all"),
        ]);

        const orders = ordersRes.data;
        const pending = orders.filter((o) => o.status === "pending").length;
        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        setStats({
          totalProducts: productsRes.data.length,
          totalCategories: categoriesRes.data.length,
          totalOrders: orders.length,
          pendingOrders: pending,
          totalRevenue: revenue,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Sandwich,
      link: "/admin/products",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      link: "/admin/categories",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ClipboardList,
      link: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: ClipboardList,
      link: "/admin/orders",
      highlight: stats.pendingOrders > 0,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Overview of your Mxsmash Burger business</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  to={card.link}
                  className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all ${
                    card.highlight ? "border-[#d4a437]/50" : "border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${card.highlight ? "text-[#d4a437]" : "text-gray-500"}`} />
                    {card.highlight && (
                      <span className="w-2 h-2 bg-[#d4a437] rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-3xl font-extrabold text-white mb-1">{card.value}</p>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                </Link>
              );
            })}
          </div>

          {/* Revenue card */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#d4a437]" />
              <p className="text-gray-400 text-sm">Total Revenue (all orders)</p>
            </div>
            <p className="text-4xl font-extrabold text-[#d4a437]">
              ₦{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          {/* Quick actions */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/admin/products"
                className="flex items-center justify-between text-gray-300 hover:text-[#d4a437] transition-colors py-2"
              >
                <span>Manage products & add-ons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center justify-between text-gray-300 hover:text-[#d4a437] transition-colors py-2"
              >
                <span>Review and update orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center justify-between text-gray-300 hover:text-[#d4a437] transition-colors py-2"
              >
                <span>Organize menu categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;