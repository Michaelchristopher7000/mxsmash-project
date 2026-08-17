import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// Create the context that will hold auth state (user info, login/logout functions)
const AuthContext = createContext();

// This provider wraps the whole app so any component can access auth state
export const AuthProvider = ({ children }) => {
  // Holds the currently logged-in user's info (null if not logged in)
  const [user, setUser] = useState(null);

  // Tracks whether we're still checking localStorage for an existing session
  // Prevents flashing "not logged in" UI before we've checked
  const [loading, setLoading] = useState(true);

  // On first app load, check if a user was already logged in (saved in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // done checking, safe to render the app now
  }, []);

  // Logs a user in by calling the backend, then saves the token + user info
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token); // used by axios interceptor for future requests
    localStorage.setItem("user", JSON.stringify(data)); // so we stay logged in after refresh
    setUser(data);
    return data;
  };

  // Registers a new user, then logs them in immediately (same as login)
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Clears saved session data and resets user state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Updates the user state in memory and localStorage (e.g. after profile edit)
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // Makes user, loading, and the functions above available to any child component
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can just do: const { user, login } = useAuth();
// instead of importing useContext + AuthContext everywhere
export const useAuth = () => useContext(AuthContext);