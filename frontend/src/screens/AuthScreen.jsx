import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function PasswordStrength({ password }) {
  if (!password) return null;
  const len = password.length;
  const level = len >= 8 ? (len >= 12 ? 3 : 2) : 1;
  const colors = ["#FF3838", "#FF9900", "#00FF87"];
  const labels = ["Weak", "Medium", "Strong"];
  return (
    <div className="auth-strength">
      <div className="auth-strength-bar">
        <div
          className="auth-strength-fill"
          style={{ width: `${(level / 3) * 100}%`, background: colors[level - 1] }}
        />
      </div>
      <span className="auth-strength-label" style={{ color: colors[level - 1] }}>
        {labels[level - 1]}
      </span>
    </div>
  );
}

export default function AuthScreen({ onAuthenticated }) {
  const { login, register, guestLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  function triggerShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          setError("Email and password required");
          triggerShake();
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!email || !password || !username) {
          setError("All fields required");
          triggerShake();
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
      triggerShake();
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
      triggerShake();
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

      <div className="auth-split">
        {/* Left decorative panel */}
        <div className="auth-hero-panel">
          <div className="auth-hero-content">
            <span className="auth-hero-icon">⚡</span>
            <h1 className="auth-hero-title">Unbeatable</h1>
            <p className="auth-hero-tagline">Challenge Perfect AI</p>
            <div className="auth-hero-games">
              {["✕", "∑", "◉", "🃏", "✊", "⬤"].map((icon, i) => (
                <span key={i} className="auth-hero-game-icon">{icon}</span>
              ))}
            </div>
            <p className="auth-hero-desc">
              6 classic games powered by unbeatable algorithms.
              Test your strategy against AI that plays perfectly.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className={`auth-container ${shaking ? "auth-shake" : ""}`}>
          <div className="auth-logo auth-logo-mobile">
            <span className="auth-logo-icon">⚡</span>
            <span className="auth-logo-text">Unbeatable</span>
          </div>
          <p className="auth-tagline auth-tagline-mobile">Challenge Perfect AI</p>

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
              <div className="auth-field auth-field-animate" style={{ animationDelay: "0.05s" }}>
                <label className="auth-label">Username</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">👤</span>
                  <input
                    className="auth-input auth-input-icon-pad"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            <div className="auth-field auth-field-animate" style={{ animationDelay: "0.1s" }}>
              <label className="auth-label">Email</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">📧</span>
                <input
                  className="auth-input auth-input-icon-pad"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field auth-field-animate" style={{ animationDelay: "0.15s" }}>
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input auth-input-icon-pad auth-input-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {!isLogin && <PasswordStrength password={password} />}
              {isLogin && (
                <span className="auth-forgot">Forgot password?</span>
              )}
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : isLogin ? "Sign In" : "Create Account"}
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

          <p className="auth-social-proof">
            Join 1,000+ players already challenging the AI
          </p>
        </div>
      </div>
    </div>
  );
}
