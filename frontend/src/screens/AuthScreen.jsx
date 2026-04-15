import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthScreen({ onAuthenticated }) {
  const { login, register, guestLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          setError("Email and password required");
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!email || !password || !username) {
          setError("All fields required");
          setLoading(false);
          return;
        }
        await register(username, email, password);
      }
      onAuthenticated();
    } catch (err) {
      let errorMsg = err.error || "Authentication failed";
      if (errorMsg.includes("fetch failed") || errorMsg.includes("Network")) {
        errorMsg = "Cannot connect to server. Is the backend running on port 5000?";
      } else if (errorMsg.includes("Database unavailable")) {
        errorMsg = "Database not connected. Start PostgreSQL and run: npm run migrate";
      } else if (errorMsg.includes("User not found")) {
        errorMsg = "Email not found. Please sign up first.";
      } else if (errorMsg.includes("Invalid password")) {
        errorMsg = "Incorrect password. Try again.";
      } else if (errorMsg.includes("already exists")) {
        errorMsg = "Email or username already registered.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await guestLogin();
      onAuthenticated();
    } catch (err) {
      const errorMsg = err.error || "Guest login failed";
      const details = err.details || "";
      let displayError = errorMsg;
      if (errorMsg.includes("fetch failed") || errorMsg.includes("Network")) {
        displayError = "Cannot connect to server. Is the backend running on port 5000?";
      } else if (errorMsg.includes("Database unavailable")) {
        displayError = "Database not connected. Start PostgreSQL and run: npm run migrate";
      } else if (details) {
        displayError = `${errorMsg}: ${details}`;
      }
      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="particles">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 5.56) % 100}%`,
              animationDelay: `${(i * 0.55) % 8}s`,
              animationDuration: `${9 + (i % 7)}s`,
            }}
          />
        ))}
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <span className="auth-logo-text">Unbeatable</span>
        </div>
        <p className="auth-tagline">Challenge Perfect AI · Win if you can</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={loading}
                autoComplete="username"
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <div className="auth-divider-line" />
        </div>

        <button
          type="button"
          className="auth-guest-btn"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue as Guest"}
        </button>
      </div>
    </div>
  );
}
