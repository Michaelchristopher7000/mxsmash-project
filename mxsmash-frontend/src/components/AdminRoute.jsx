import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps admin pages - redirects non-admins away entirely
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still checking localStorage for existing session - don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  // Not logged in, or logged in but not an admin - send them away
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;