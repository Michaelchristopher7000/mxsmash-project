import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sandwich, Tag, ClipboardList, LogOut, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminRoute from "../components/AdminRoute";


const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Sandwich },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#0d0d0d] text-white lg:flex">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-40">
          <Link to="/" className="flex items-center">
            <img src="/mxsmash-logo.png" alt="MX Smash" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/mxsmash-logo.png" alt="MX Smash Admin" className="h-8 w-auto" />
            </Link>
            <button
              onClick={closeSidebar}
              className="lg:hidden text-gray-500 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active
                      ? "bg-[#d4a437] text-black"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-1">
            <p className="px-4 text-xs text-gray-500 mb-2">
              Logged in as {user?.name}
            </p>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Site
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;