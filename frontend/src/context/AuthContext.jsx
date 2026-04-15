import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing token on mount
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          api.setToken(token);
          const profile = await api.getProfile();
          setUser(profile);
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("token");
        api.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.error || "Login failed";
      setError(errorMsg);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const data = await api.register(username, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.error || "Registration failed";
      setError(errorMsg);
      throw err;
    }
  };

  const guestLogin = async () => {
    setError(null);
    try {
      const data = await api.guestLogin();
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.error || "Guest login failed";
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    api.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
