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
      setError(err.error || "Authentication failed");
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
      setError(err.error || "Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="glow-bg" style={{ background: "radial-gradient(circle at 50% 50%, rgba(226,192,96,0.15) 0%, transparent 50%)" }} />
      <div className="particles">
        {Array.from({ length: 15 }, (_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 6.67) % 100}%`,
              animationDelay: `${(i * 0.5) % 7}s`,
              animationDuration: `${7 + (i % 8)}s`,
            }}
          />
        ))}
      </div>

      <main className="main" style={{ justifyContent: "center" }}>
        <div className="auth-container">
          <div className="auth-header">
            <span className="logo-icon" style={{ fontSize: "40px" }}>⚡</span>
            <h1 className="auth-title">Unbeatable Games</h1>
            <p className="auth-subtitle">Play Perfect AI · Master Algorithms</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {!isLogin && (
              <div className="auth-input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>
            )}

            <div className="auth-input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button
            type="button"
            className="auth-btn auth-btn-guest"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue as Guest"}
          </button>

          <p className="auth-note">
            No account needed to play. Create one to save your stats and compete on leaderboards! 🎮
          </p>
        </div>
      </main>
    </div>
  );
}
